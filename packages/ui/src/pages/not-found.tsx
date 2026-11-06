import { Column, Heading } from "@/once-ui/components";

export default function NotFound() {
  return (
    <Column as="section" fill center paddingBottom="160">
      <Typography marginBottom="s" variant="display-strong-xl">
        404
      </Typography>
      <Heading marginBottom="l" variant="display-default-xs">
        Page Not Found
      </Heading>
      <Typography onBackground="neutral-weak">
        The page you are looking for does not exist.
      </Typography>
    </Column>
  );
}
