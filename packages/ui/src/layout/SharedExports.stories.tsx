import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../buttons";
import { Card, CardContent, CardHeader, CardTitle } from "../cards";
import { Input, Label } from "../forms";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "../navigation";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../overlays";
import { FlexCol } from ".";

const meta = { title: "UI/Layout/Shared Exports" } satisfies Meta;
export default meta;

export const EditDraft: StoryObj<typeof meta> = {
  render: () => (
    <FlexCol gap="md" maxWidth={32} width="full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Projects</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Project draft</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button">Rename draft</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Rename draft</DialogTitle>
              <DialogDescription>Choose a title for the draft.</DialogDescription>
              <div className="grid gap-xs">
                <Label htmlFor="shared-exports-title">Draft title</Label>
                <Input defaultValue="Research notes" id="shared-exports-title" />
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </FlexCol>
  ),
};
