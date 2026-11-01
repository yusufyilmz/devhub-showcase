"use client";

import { useState } from "react";

import { copy } from "@shared/config";
import { IconButton } from "@shared/ui/icon-button";
import { InfoIcon } from "@shared/ui/icons";
import { List, ListItem } from "@shared/ui/list";
import { Popover, PopoverContent, PopoverTrigger } from "@shared/ui/popover";
import { Typography } from "@shared/ui/typography";

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
    <div className="-mt-1">
      <Popover open={open}>
        <PopoverTrigger asChild>
          <IconButton
            aria-haspopup="true"
            aria-label="About project"
            className="icon-button"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <InfoIcon />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent className="pointer-events-none w-auto max-w-[500px]" id={id} side="bottom">
          <section className="max-w-[500px] p-8" id="about-development">
            <Typography variant="h5">{copy.aboutSection.title}</Typography>
            <Typography variant="body1">{copy.aboutSection.description}</Typography>
            <List className="p-1 border-none shadow-none">
              {copy.aboutSection.technologies.map((tech) => (
                <ListItem className="p-0 m-0" key={tech.name}>
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
