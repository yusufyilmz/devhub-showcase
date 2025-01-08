import 'dotenv/config';
import { Education, Experience, ResourceService, Skill } from '../../types';

export const usePrisma = process.env.ORM_TYPE === 'prisma';

let ExperienceService: ResourceService<Experience>;
let SkillService: ResourceService<Skill>;
let EducationService: ResourceService<Education>;
let ProjectService: ResourceService<Education>;
let ReferralService: ResourceService<Education>;

if (usePrisma) {
    ExperienceService = require('../resources/prisma/experience').ExperienceService;
    SkillService = require('../resources/prisma/skill').SkillService;
    EducationService = require('../resources/prisma/education').EducationService;
    ProjectService = require('../resources/prisma/project').ProjectService;
    ReferralService = require('../resources/prisma/referral').ReferralService;
} else {
    ExperienceService = require('../resources/supabase/experience').ExperienceService;
    SkillService = require('../resources/supabase/skill').SkillService;
    EducationService = require('../resources/supabase/education').EducationService;
    ProjectService = require('../resources/supabase/project').ProjectService;
    ReferralService = require('../resources/supabase/referral').ReferralService;
}

export { EducationService, ExperienceService, ProjectService, ReferralService, SkillService };
