export const useCopyClipboard = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return { copyToClipboard };
};
