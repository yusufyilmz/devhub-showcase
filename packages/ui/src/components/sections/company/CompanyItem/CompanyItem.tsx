import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Card,
  CardBody,
  Typography,
  ArrowDownwardIcon,
  Divider
} from '../../../../components'
import { CompanyWithProjects } from '@shared/lib/types'
import Link from 'next/link'

type CompanyProps = {
  company: CompanyWithProjects
}

export const CompanyItem: React.FC<CompanyProps> = ({ company }) => {
  return (
    <Card className="max-w-80 md:min-w-96 align-middle company-card card-base">
      <Link href={company.link} target="_blank" rel="noopener noreferrer">
        <CardBody className="w-full pt-4 pb-0 flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-textColor-primary hover:underline">
            {company.name}
          </h3>
          <Divider />
        </CardBody>
      </Link>
      <CardBody className="w-full mx-auto pt-0">
        <Accordion
          open={true}
          className="bg-backgroundColor-card"
          icon={<ArrowDownwardIcon />}
        >
          <AccordionHeader
            className=" bg-backgroundColor-card mx-auto"
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography className="m-0 p-0">Projects</Typography>
          </AccordionHeader>
          <AccordionBody className="">
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
          </AccordionBody>
        </Accordion>
      </CardBody>
    </Card>
  )
}
