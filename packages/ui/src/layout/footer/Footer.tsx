import styles from "./Footer.module.scss";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Flex as="footer" fillWidth padding="8" horizontal="center" mobileDirection="column">
      <Flex
        className={styles.mobile}
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="16"
        horizontal="space-between"
        vertical="center"
      >
        <Typography variant="body-default-s" onBackground="neutral-strong">
          <Typography onBackground="neutral-weak">© {currentYear} /</Typography>
          <Typography paddingX="4">{person.name}</Typography>
          <Typography onBackground="neutral-weak">
            {/* Usage of this template requires attribution. Please don't remove the link to Once UI. */}
            / Build your portfolio with{" "}
            <SmartLink href="https://once-ui.com/templates/magic-portfolio">Once UI</SmartLink>
          </Typography>
        </Typography>
        <Flex gap="16">
          {social.map(
            (item) =>
              item.link && (
                <IconButton
                  key={item.name}
                  href={item.link}
                  icon={item.icon}
                  tooltip={item.name}
                  size="s"
                  variant="ghost"
                />
              ),
          )}
        </Flex>
      </Flex>
      <Flex height="80" show="s"></Flex>
    </Flex>
  );
};
