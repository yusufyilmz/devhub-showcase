"use client";

import type React from "react";
import { useEffect, useState } from "react";

import { TextField } from "@mui/material";
import { Button } from "@shared/components";
import type { Project } from "@shared/lib/types";

interface ProjectFormProps {
  action: string;
  initialData?: Project;
  isSubmitting: boolean;
  onSubmit: (_e: unknown) => void;
}

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
    <form className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg" onSubmit={handleSubmit}>
      <TextField
        className="mb-4"
        label="Project Title"
        name="title"
        onChange={handleChange}
        required
        value={formData.title}
      />
      <TextField
        className="mb-4"
        label="Description"
        name="description"
        onChange={handleChange}
        required
        rows={4}
        value={formData.description}
      />
      <TextField
        className="mb-4"
        label="Project Link"
        name="link"
        onChange={handleChange}
        required
        value={formData.link}
      />
      <Button aria-label={action} disabled={isSubmitting} fullWidth variant="contained">
        {action}
      </Button>
    </form>
  );
};
