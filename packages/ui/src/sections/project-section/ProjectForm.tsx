"use client";

import type React from "react";
import { useEffect, useState } from "react";

import { Button } from "../../buttons/button";
import { Label as LibraryLabel } from "../../forms/label/Label";
import { TextField } from "../../forms/text-field";
import { Textarea } from "../../forms/textarea";
import { projectFormStyles } from "./styles";
import type { ProjectFormProps } from "./types";

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  isSubmitting,
  action,
  initialData = { description: "", link: "", title: "" },
}) => {
  const [formData, setFormData] = useState({
    description: "",
    link: "",
    title: "",
  });

  useEffect(() => {
    setFormData({
      ...initialData,
      link: initialData.link ?? "",
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className={projectFormStyles.element1} onSubmit={handleSubmit}>
      <TextField
        className={projectFormStyles.element2}
        label="Project Title"
        name="title"
        onChange={handleChange}
        required
        value={formData.title}
      />
      <LibraryLabel className={projectFormStyles.element3} htmlFor="description" unstyled>
        Description
        <Textarea
          name="description"
          onChange={handleChange}
          required
          rows={4}
          value={formData.description}
        />
      </LibraryLabel>
      <TextField
        className={projectFormStyles.element4}
        label="Project Link"
        name="link"
        onChange={handleChange}
        required
        value={formData.link}
      />
      <Button
        aria-label={action}
        className={projectFormStyles.element5}
        disabled={isSubmitting}
        variant="default"
      >
        {action}
      </Button>
    </form>
  );
};
