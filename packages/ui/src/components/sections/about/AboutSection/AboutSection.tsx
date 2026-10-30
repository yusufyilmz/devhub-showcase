"use client";

import { useState } from "react";

import { copy } from "@shared/content";

import { IconButton } from "../../../ui/IconButton/IconButton";
import { InfoIcon } from "../../../ui/Icons/Icons";
import { List } from "../../../ui/List/List";
import { ListItem } from "../../../ui/List/ListItem";
import { Popover } from "../../../ui/Popover";
import { Typography } from "../../../ui/Typography/Typography";

export const AboutSection = () => {
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
      <IconButton
        aria-haspopup="true"
        aria-label="About project"
        aria-owns={open ? "mouse-over-popover" : undefined}
        className="icon-button"
        color="primary"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <InfoIcon />
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        disableAutoFocus
        disableRestoreFocus
        id={id}
        open={open}
        sx={{ pointerEvents: "none" }}
        transformOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
      >
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
      </Popover>
    </div>
  );
};
