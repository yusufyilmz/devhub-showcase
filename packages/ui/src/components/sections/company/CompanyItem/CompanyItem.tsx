import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Typography
} from '@mui/material'
import { CompanyWithProjects } from '@shared/lib/types'
import Link from 'next/link'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Divider from '@mui/material/Divider'

type CompanyProps = {
  company: CompanyWithProjects
}

export const CompanyItem: React.FC<CompanyProps> = ({ company }) => {
  return (
    <Card className="max-w-80 md:min-w-96 align-middle company-card card-base">
      <Link href={company.link} target="_blank" rel="noopener noreferrer">
        <CardContent className="w-full pt-4 pb-0 flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-textColor-primary hover:underline">
            {company.name}
          </h3>
          <Divider />
        </CardContent>
      </Link>
      <CardContent className="w-full mx-auto pt-0">
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
              {company.projects.map(project => (
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
    </Card>
  )
}
