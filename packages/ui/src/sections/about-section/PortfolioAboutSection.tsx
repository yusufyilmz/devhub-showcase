"use client";

import { useState } from "react";

import { copy } from "@shared/config";

import { IconButton } from "../../buttons/icon-button";
import { InfoIcon } from "../../display/icons";
import { List, ListItem } from "../../display/list";
import { Typography } from "../../display/typography";
import { Popover, PopoverContent, PopoverTrigger } from "../../overlays/popover";
import { portfolioAboutSectionStyles } from "./styles";

export const PortfolioAboutSection = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "about-popover" : undefined;

  return (
    <div className={portfolioAboutSectionStyles.element1}>
      <Popover open={open}>
        <PopoverTrigger asChild>
          <IconButton
            aria-haspopup="true"
            aria-label="About project"
            className={portfolioAboutSectionStyles.element2}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <InfoIcon />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent className={portfolioAboutSectionStyles.element3} id={id} side="bottom">
          <section className={portfolioAboutSectionStyles.element4} id="about-development">
            <Typography variant="h5">{copy.aboutSection.title}</Typography>
            <Typography variant="body1">{copy.aboutSection.description}</Typography>
            <List className={portfolioAboutSectionStyles.element5}>
              {copy.aboutSection.technologies.map((tech) => (
                <ListItem className={portfolioAboutSectionStyles.element6} key={tech.name}>
                  <Typography variant="body2">
                    <strong>{tech.name}:</strong> {tech.details}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Typography variant="body1">{copy.aboutSection.conclusion}</Typography>
          </section>
        </PopoverContent>
      </Popover>
    </div>
  );
};
