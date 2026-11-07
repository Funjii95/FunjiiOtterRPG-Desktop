"""Authorized paired rollout. Credentials and full service configurations stay in memory/DPAPI."""
import copy,hashlib,io,json,pathlib,runpy,sys,tarfile,urllib.parse
mode=sys.argv[1];sys.argv=[sys.argv[0],'noop']
h=runpy.run_path(str(pathlib.Path(__file__).with_name('backend-release.py')))
ROOT=h['ROOT'];STATE=h['STATE'];api=h['api'];gate=h['gate'];BASE=h['BASE'];PROJECT=h['PROJECT'];REGION=h['REGION']
path=STATE/'snapshot-size-cloud.json'
SOURCE=ROOT/'tools/plugin-release/Sync'
def save(v):path.write_text(json.dumps(v))
def load():return json.loads(path.read_text())
def current():return h['services']()
if mode=='inspect':
 b,p=current();gate(b,p)
 for x in [b,p]:print(json.dumps({'name':x['name'].split('/')[-1],'latestReadyRevision':x.get('latestReadyRevision'),'traffic':x.get('traffic',[])}))
elif mode=='build':
 b,p=current();gate(b,p);state={'services':[]}
 (STATE/'snapshot-size-rollback.dpapi').write_bytes(h['protected_backup']([b,p]))
 for project,service in [('Backend',b),('SnapshotPublisher',p)]:
  folders=[project,'SnapshotProtocol']+(['SnapshotFirestore'] if project=='SnapshotPublisher' else [])
  docker='FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build\nWORKDIR /source\nCOPY Directory.Build.props ./\n'+''.join(f'COPY src/{x}/ src/{x}/\n' for x in folders)+f'RUN dotnet restore src/{project}/{project}.csproj --locked-mode\nRUN dotnet publish src/{project}/{project}.csproj -c Release -o /app --no-restore /p:UseAppHost=false\nFROM mcr.microsoft.com/dotnet/aspnet:10.0\nWORKDIR /app\nCOPY --from=build /app .\nUSER $APP_UID\nEXPOSE 8080\nENTRYPOINT ["dotnet","{project}.dll"]\n'
  buf=io.BytesIO()
  with tarfile.open(fileobj=buf,mode='w:gz') as tar:
   blob=docker.encode();info=tarfile.TarInfo('Dockerfile');info.size=len(blob);tar.addfile(info,io.BytesIO(blob));tar.add(SOURCE/'Directory.Build.props',arcname='Directory.Build.props')
   for folder in folders:
    for file in sorted((SOURCE/'src'/folder).rglob('*')):
     if file.is_file() and not any(x in {'bin','obj'} for x in file.relative_to(SOURCE).parts):tar.add(file,arcname=file.relative_to(SOURCE).as_posix())
  stamp=hashlib.sha256(buf.getvalue()).hexdigest()[:10];image=f'{REGION}-docker.pkg.dev/{PROJECT}/otter-rpg-test/{project.lower()}:snapshotsize-{stamp}'
  obj=f'source/snapshotsize-{project.lower()}-{stamp}.tgz'
  api(f'https://storage.googleapis.com/upload/storage/v1/b/{PROJECT}_cloudbuild/o?uploadType=media&name='+urllib.parse.quote(obj,safe=''),'POST',buf.getvalue(),'application/gzip')
  job={'source':{'storageSource':{'bucket':PROJECT+'_cloudbuild','object':obj}},'steps':[{'name':'gcr.io/cloud-builders/docker','args':['build','-t',image,'.']}],'images':[image],'serviceAccount':f'projects/{PROJECT}/serviceAccounts/otter-rpg-test-builder@{PROJECT}.iam.gserviceaccount.com','options':{'logging':'CLOUD_LOGGING_ONLY'},'timeout':'900s'}
  result=api(f'https://cloudbuild.googleapis.com/v1/projects/{PROJECT}/locations/{REGION}/builds','POST',job)
  state['services'].append({'project':project,'service':service['name'].split('/')[-1],'buildId':result['metadata']['build']['id'],'image':image,'revision':service['name'].split('/')[-1]+'-snapshotsize-'+stamp})
 save(state);print('Two cloud builds started; existing traffic unchanged.')
elif mode=='status':
 s=load()
 for x in s['services']:
  result=api(f'https://cloudbuild.googleapis.com/v1/projects/{PROJECT}/locations/{REGION}/builds/'+x['buildId']);print(x['project'],result['status'])
  if result['status']=='SUCCESS':x['digest']=result['results']['images'][0]['digest']
 save(s)
elif mode=='logs':
 for x in load()['services']:
  entries=api('https://logging.googleapis.com/v2/entries:list','POST',{'resourceNames':['projects/'+PROJECT],'filter':'resource.type="build" AND resource.labels.build_id="'+x['buildId']+'"','orderBy':'timestamp desc','pageSize':24}).get('entries',[])
  print(x['project'])
  for entry in reversed(entries):print(str(entry.get('textPayload',''))[:1200])
elif mode=='stage':
 s=load();b,p=current();plans=[copy.deepcopy(b),copy.deepcopy(p)]
 for x,plan in zip(s['services'],plans):
  if not x.get('digest'):raise RuntimeError('Both builds must succeed first')
  plan['template']['revision']=x['revision'];plan['template']['containers'][0]['image']=x['image'].split(':snapshotsize-')[0]+'@'+x['digest']
 gate(*plans)
 for x,plan,old in zip(s['services'],plans,[b,p]):
  traffic=copy.deepcopy(old.get('traffic',[]))
  for t in traffic:
   if t.get('type')=='TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST':t['type']='TRAFFIC_TARGET_ALLOCATION_TYPE_REVISION';t['revision']=old['latestReadyRevision'].split('/')[-1]
  gate(*plans)
  op=api(BASE+x['service']+'?updateMask=template,traffic','PATCH',{'name':old['name'],'etag':old['etag'],'template':plan['template'],'traffic':traffic});x['operation']=op['name']
 save(s);print('Both revisions staged; traffic preserved.')
elif mode=='operation':
 for x in load()['services']:
  result=api('https://run.googleapis.com/v2/'+x['operation']);print(x['project'],'done',result.get('done',False),'error',bool(result.get('error')))
elif mode in {'publisher','backend'}:
 s=load();b,p=current();gate(b,p);idx=1 if mode=='publisher' else 0;x=s['services'][idx];service=[b,p][idx]
 revision=api(BASE+x['service']+'/revisions/'+x['revision'])
 if not any(c.get('type')=='Ready' and c.get('state')=='CONDITION_SUCCEEDED' for c in revision.get('conditions',[])):raise RuntimeError('Revision not ready')
 tags={'rc1'} if idx==1 else {'desktop','rc1'}
 targets=copy.deepcopy(service.get('traffic',[]))
 for t in targets:
  if t.get('tag') in tags:t['type']='TRAFFIC_TARGET_ALLOCATION_TYPE_REVISION';t['revision']=x['revision']
 for tag in tags:
  if not any(t.get('tag')==tag for t in targets):targets.append({'type':'TRAFFIC_TARGET_ALLOCATION_TYPE_REVISION','revision':x['revision'],'tag':tag,'percent':0})
 gate(b,p);op=api(BASE+x['service']+'?updateMask=traffic','PATCH',{'name':service['name'],'etag':service['etag'],'traffic':targets});x['operation']=op['name'];save(s);print(mode,'tag update started; default traffic retained.')

elif mode=='verify':
 import urllib.request
 b,p=current();gate(b,p);s=load()
 for idx,(service,tag) in enumerate([(b,'desktop'),(p,'rc1')]):
  active=next(t for t in service.get('traffic',[]) if t.get('tag')==tag)
  if active['revision']!=s['services'][idx]['revision']:raise RuntimeError('Active revision differs from tested release')
  uri=next(t['uri'] for t in service['trafficStatuses'] if t.get('tag')==tag)
  with urllib.request.urlopen(uri+'/health/live',timeout=45) as response:assert response.status==200
  if idx==0:
   with urllib.request.urlopen(uri+'/api/v1/desktop/config',timeout=45) as response:config=json.load(response);assert config['enabled'] and config['protocolVersion']==1
  print(service['name'].split('/')[-1],tag,active['revision'],'health OK')
