import {it,expect} from 'vitest';
import {experienceProgress} from '../src/ExperienceProgress';
it('shows progress within the current level using the actual configured thresholds',()=>{expect(experienceProgress(2,1500,{ExperiencePerLevel:1000,MaximumLevel:99})).toEqual({max:false,current:500n,required:2000n,next:3,percentage:25});});
it('uses the configured maximum level and never invents progress with missing rules',()=>{expect(experienceProgress(99,99999999,{ExperiencePerLevel:1000,MaximumLevel:99})?.max).toBe(true);expect(experienceProgress(2,1500)).toBeUndefined();expect(experienceProgress(1,300,{ExperiencePerLevel:600,MaximumLevel:99})?.percentage).toBe(50);});
