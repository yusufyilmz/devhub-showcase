import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Chip,
  Typography
} from '@mui/material'
import { ExperienceWithCompanyProjectAndSkills } from '@shared/lib/types'
import Link from 'next/link'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Divider from '@mui/material/Divider'

type ExperienceProps = {
  experience: ExperienceWithCompanyProjectAndSkills
}

export const ExperienceItem: React.FC<ExperienceProps> = ({
  experience: experience
}) => {
  const skills = experience.projects.flatMap(project => project.skills)
  const uniqueSkills = new Set(skills.map(skill => skill.name))

  return (
    <Card className="max-w-80 md:min-w-96 align-middle  bg-backgroundColor-card rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 experience-card border">
      <Link
        href={experience.company?.link ?? ''}
        target="_blank"
        rel="noopener noreferrer"
      >
        <CardContent className="pt-4 pb-0 flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-textColor-primary hover:underline">
            {experience.company?.name}
          </h3>
          <Divider />
          <h4 className="text-lg font-semibold text-textColor-secondary">
            {experience.role}
          </h4>
          <p className="text-xs font-light pb-0 text-textColor-secondary mt-2">
            {new Date(experience.startedAt).toLocaleDateString()} -{' '}
            {experience.finishedAt
              ? new Date(experience.finishedAt).toLocaleDateString()
              : 'Present'}
          </p>
        </CardContent>
      </Link>
      <CardContent className="mx-auto pt-0">
        <Accordion className="bg-backgroundColor-card">
          <AccordionSummary
            className=" bg-backgroundColor-card mx-auto"
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography className="m-0 p-0">Projects</Typography>
          </AccordionSummary>
          <AccordionDetails className="">
            <ul className="project-list mt-4 space-y-2">
              {experience.projects.map(project => (
                <li key={project.id}>
                  <a
                    href={`#${project.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {project.title}
                  </a>
                </li>
              ))}
            </ul>
          </AccordionDetails>
        </Accordion>
      </CardContent>
      <CardContent className="mx-auto pt-0">
        <Accordion className="bg-backgroundColor-card">
          <AccordionSummary
            className=" bg-backgroundColor-card mx-auto"
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography className="m-0 p-0">Skills</Typography>
          </AccordionSummary>
          <AccordionDetails className="">
            <div className="flex flex-wrap gap-2">
              {[...uniqueSkills].map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  className="bg-main-silver text-main-black"
                />
              ))}
            </div>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  )
}
