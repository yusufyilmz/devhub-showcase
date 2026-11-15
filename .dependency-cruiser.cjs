module.exports = {
  forbidden: [
    {
      comment: "Shared packages must not depend on applications.",
      from: { path: "^packages/" },
      name: "no-packages-importing-apps",
      severity: "error",
      to: { path: "^apps/" },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
  },
};
