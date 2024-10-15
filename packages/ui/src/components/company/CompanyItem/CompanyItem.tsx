import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Typography } from '@mui/material'
import { CompanyWithProjects } from '@shared/lib/types'
import Link from 'next/link'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Divider from '@mui/material/Divider';

type CompanyProps = {
  company: CompanyWithProjects
}

export const CompanyItem: React.FC<CompanyProps> = ({ company }) => {
  return (
    <Card className="max-w-80 md:min-w-96 flex flex-col h-full align-middle  bg-backgroundColor-card rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 company-card border">
      <Link href={company.url} target="_blank" rel="noopener noreferrer">
        <CardContent className='pt-4 pb-0 flex flex-col gap-2'>
          <h3 className="text-2xl font-bold text-textColor-primary hover:underline">
            {company.name}
          </h3>
          <Divider />
          <h4 className="text-lg font-semibold text-textColor-secondary">
            {company.role}
          </h4>
          <p className="text-xs font-light pb-0 text-textColor-secondary mt-2">
            {new Date(company.startedAt).toLocaleDateString()} -{' '}
            {company.finishedAt
              ? new Date(company.finishedAt).toLocaleDateString()
              : 'Present'}
          </p>
        </CardContent>
      </Link>
      <CardContent className='mx-auto pt-0'>
        <Accordion className='bg-backgroundColor-card' >
          <AccordionSummary
            className=' bg-backgroundColor-card mx-auto'
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography className='m-0 p-0'>Projects</Typography>
          </AccordionSummary>
          <AccordionDetails className=''>
            <ul className="project-list mt-4 space-y-2">
              {company.projects.map(project => (
                <li key={project.id}>
                  <a href={`#${project.id}`} className="text-blue-500 hover:underline">
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

<Typography variant="body2" className="text-gray-500">
  No projects available.
</Typography>
