type FontOptions = { variable?: string };

function font(options: FontOptions = {}) {
  return {
    className: "",
    style: { fontFamily: "Inter, sans-serif" },
    variable: options.variable ?? "",
  };
}

export function Inter(options?: FontOptions) {
  return font(options);
}

export default { Inter };
