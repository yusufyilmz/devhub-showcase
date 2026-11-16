"use client";

import type React from "react";
import { useEffect, useId, useState } from "react";

import { Button } from "../../buttons";
import { Label as LibraryLabel } from "../../forms/label";
import { TextField } from "../../forms/text-field";
import { Textarea } from "../../forms/textarea";
import { projectFormStyles } from "./styles";
import type { ProjectFormProps } from "./types";

const emptyProject = { description: "", link: "", title: "" };

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  isSubmitting,
  action,
  initialData = emptyProject,
}) => {
  const descriptionId = useId();
  const [formData, setFormData] = useState(emptyProject);

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
        label="Project Title"
        name="title"
        onChange={handleChange}
        required
        value={formData.title}
      />
      <LibraryLabel className={projectFormStyles.description} htmlFor={descriptionId} unstyled>
        Description
        <Textarea
          id={descriptionId}
          name="description"
          onChange={handleChange}
          required
          rows={4}
          value={formData.description}
        />
      </LibraryLabel>
      <TextField
        label="Project Link"
        name="link"
        onChange={handleChange}
        required
        value={formData.link}
      />
      <Button
        aria-label={action}
        className="w-full"
        disabled={isSubmitting}
        type="submit"
        variant="default"
      >
        {action}
      </Button>
    </form>
  );
};
