type FeatureEntry = [
  id: string,
  title: string,
  message: string,
  context?: string,
  href?: string,
  label?: string,
];

function group(name: string, entries: FeatureEntry[]) {
  return entries.map(([id, title, message, context, href, label]) => ({
    action: href && label ? { href, label } : undefined,
    context,
    group: name,
    id,
    message,
    title,
  }));
}

export const studioCompanionFeatures = [
  ...group("Build your portfolio", [
    [
      "workspace",
      "Your private workspace",
      "Want to work on your portfolio? Open your workspace to edit your profile and CV in one place.",
      "Home",
      "/admin",
      "Open workspace",
    ],
    [
      "examples",
      "Portfolio examples",
      "Need a starting point? Browse example portfolios and see how their matching CVs look.",
      "Home",
      "/#examples",
      "Browse examples",
    ],
    [
      "profile",
      "Profile and introduction",
      "Tell visitors who you are, what you do and which details they can use to reach you.",
      "Profile",
    ],
    [
      "career",
      "Experience and achievements",
      "Add a role and the outcomes you’re proud of in Experience.",
      "Experience",
    ],
    [
      "projects",
      "Projects and media",
      "Show your work with links and cover images. Keep individual projects private until you’re ready.",
      "Projects",
    ],
    [
      "education",
      "Education",
      "Add your degrees or training in Education so they can appear in your portfolio and CV.",
      "Education",
    ],
    [
      "skills",
      "Skill groups",
      "Group related skills so someone can skim your strengths quickly.",
      "Skills",
    ],
    [
      "languages",
      "Spoken languages",
      "List the languages you speak and your proficiency in each.",
      "Languages",
    ],
    [
      "layout",
      "Portfolio layouts",
      "Try a different portfolio layout in Layout. Your existing content comes with you.",
      "Layout",
    ],
    [
      "visual-order",
      "Drag and drop sections",
      "By the way, you can drag sections into a new order in Preview your draft. The PDF has its own layout.",
      "Section order",
    ],
    [
      "section-display",
      "Section visibility and presentation",
      "Choose which sections and items visitors see, and try a different presentation in Section display.",
      "Section display",
    ],
    [
      "custom-sections",
      "Custom sections",
      "Want to add testimonials, an FAQ, services or a gallery? Start with Custom sections.",
      "Custom sections",
    ],
    [
      "section-templates",
      "Reusable section templates",
      "Save a section to your private template library or import a configuration you’ve exported.",
      "Templates",
    ],
    [
      "appearance",
      "Themes and hero backgrounds",
      "Try a theme, accent, image or video background in Appearance.",
      "Appearance",
    ],
    [
      "responsive-preview",
      "Responsive draft preview",
      "Check how your portfolio looks on a phone, tablet and desktop before publishing.",
      "Layout",
    ],
  ]),
  ...group("Drafts, sharing and CVs", [
    [
      "draft-save",
      "Save and recover a draft",
      "Save changes to keep a private revision. The editor also offers undo, redo and draft recovery.",
      "Profile",
    ],
    [
      "history",
      "Revision history",
      "Want to revisit an earlier version? Open Revision history to review and restore it into the draft.",
      "Revision history",
    ],
    [
      "publication",
      "Publish your portfolio and CV",
      "Review publication when you’re ready to share. You can publish now, schedule it, or withdraw a published version.",
    ],
    [
      "sharing",
      "Link and access settings",
      "Choose public, unlisted or password access and review the link before sharing.",
    ],
    [
      "branding",
      "Share cards and page metadata",
      "Your published portfolio uses your name, role and accent in its share card.",
    ],
    [
      "field-visibility",
      "Website and CV visibility",
      "Choose separately which contact details appear on your website and in the PDF.",
      "Field visibility",
    ],
    [
      "locale",
      "Website and CV language",
      "You can choose different languages for the portfolio and PDF in Language settings.",
      "Language settings",
    ],
    [
      "pdf",
      "PDF layouts and download",
      "Try a different PDF layout, adjust what it includes and download a copy of your saved CV.",
      "PDF",
    ],
    [
      "cv-versions",
      "Private CV versions and job drafts",
      "Keep private CV variants, or review a draft tailored to a job description in CV versions.",
      "CV versions",
    ],
    [
      "cv-import",
      "Import an existing CV",
      "If CV import is available, upload your CV and review the extracted fields before applying them.",
      "Import CV",
    ],
    [
      "google-import",
      "Import from Google",
      "If Google import is configured, choose which profile details to share and review them before applying.",
      "Import Google",
    ],
  ]),
  ...group("Assistants and account", [
    [
      "ai-knowledge",
      "Inspect assistant knowledge",
      "Open AI profile to see which saved information is available to your assistants.",
      "AI profile",
    ],
    [
      "owner-assistant",
      "Private AI editing",
      "If your plan includes AI editing, I can suggest wording or draft changes for you to review.",
      "AI assistant",
      "/admin/chat",
      "Open Studio assistant",
    ],
    [
      "ai-tools",
      "Writing, feedback and interview prep",
      "Studio chat can help you review your portfolio, rewrite a passage or prepare for a job interview when the tools are enabled.",
      "AI assistant",
      "/admin/chat",
      "Open Studio assistant",
    ],
    [
      "visitor-assistant",
      "Public portfolio assistant",
      "Eligible accounts can enable visitor questions about their published work in Plan and usage.",
      undefined,
      "/admin/billing",
      "Open Plan and usage",
    ],
    [
      "billing",
      "Plans and AI usage",
      "Check your plan, assistant allowances and feature readiness in Plan and usage.",
      "Home",
      "/admin/billing",
      "Open Plan and usage",
    ],
    [
      "managed",
      "Managed portfolios",
      "Authorized managers can create, edit and transfer temporary portfolios from the management workspace.",
    ],
    [
      "companion",
      "Your companion",
      "Drag me to either side. You can open this guide or turn off automatic tips whenever you like.",
    ],
    [
      "fitness",
      "Try My Fitness Studio",
      "Want a space for workouts, meals and daily habits too? You can open My Fitness Studio and set up your own fitness workspace.",
      "Home",
      "https://myfitnessstudio.vercel.app/",
      "Open My Fitness Studio",
    ],
  ]),
];

export const fitnessCompanionFeatures = [
  ...group("Today and activity logging", [
    [
      "agenda",
      "Daily agenda",
      "Open Today to see your activities in time order. Select an activity to see its notes and subtasks.",
      "Today",
    ],
    [
      "progress",
      "Daily progress",
      "Tick off an activity as you go. Daily progress shows what you’ve completed or skipped.",
      "Today",
    ],
    [
      "hydration",
      "Hydration tracking",
      "Need a water break? Log a glass from the Hydration card and check it against your goal.",
      "Today",
    ],
    [
      "workouts",
      "Workouts, supersets and sets",
      "Open a workout to log reps and weight for each set. Previous results help you pick where to start.",
      "Today",
    ],
    [
      "meals",
      "Meals, ingredients and alternatives",
      "Open a meal to check its ingredients or choose an available alternative.",
      "Today",
    ],
    [
      "supplements",
      "Supplement routines",
      "Add supplements as routine tasks and check the activity details for the saved instructions.",
      "Today",
    ],
  ]),
  ...group("Plans and calendar", [
    [
      "task-plans",
      "Workout, diet and routine plans",
      "Open Tasks to choose a plan, explore its tasks and build a routine that fits your week.",
      "Tasks",
    ],
    [
      "task-edit",
      "Tasks and subtasks",
      "Create, edit or reorder the tasks inside a plan. Archive an old template to keep its past logs.",
      "Tasks",
    ],
    [
      "rotation",
      "Diet rotation and day overrides",
      "Use schedule settings to rotate meal plans and adjust an individual day as needed.",
      "Tasks",
    ],
    [
      "recurrence",
      "Weekday scheduling",
      "Give a template a time and choose the weekdays it should appear on your calendar.",
      "Tasks",
    ],
    [
      "calendar",
      "Calendar and date navigation",
      "Switch between month and week views. Select a date for its agenda or open an activity directly.",
      "Calendar",
    ],
    [
      "reschedule",
      "Reschedule an activity",
      "On desktop, drag a pending activity to another date. Its details also let you edit the date and time.",
      "Calendar",
    ],
    [
      "cooking",
      "Weekly cooking plan",
      "Open Week to turn the meals on your calendar into a cooking checklist.",
      "Week",
    ],
    [
      "shopping",
      "Weekly grocery list",
      "Open the shopping list in Week to see ingredients combined across your planned meals.",
      "Week",
    ],
    [
      "week-save",
      "Save and regenerate a week",
      "Save your cooking and shopping lists. If the meal plan changes, you can regenerate the week.",
      "Week",
    ],
  ]),
  ...group("Assistant and preferences", [
    [
      "assistant",
      "Fitness assistant",
      "Want help with a workout, a task, a shopping list or reminder? Open my chat and review the suggestion before saving.",
    ],
    [
      "reminders",
      "Activity reminders",
      "Turn on activity reminders in More. I can show a bubble when a scheduled activity is due.",
      "More",
    ],
    [
      "device-notifications",
      "Device notifications",
      "In More, set up device notifications and use the test action to check this device.",
      "More",
    ],
    [
      "goals",
      "Personal goals and time zone",
      "Set your hydration or protein targets, reminder lead time and workspace time zone in More.",
      "More",
    ],
    [
      "weight",
      "Weight tracking",
      "Log your weight in More if you want to keep a record alongside your daily routines.",
      "More",
    ],
    [
      "appearance",
      "Appearance",
      "Use the appearance control to switch your Fitness workspace between light and dark themes.",
    ],
    [
      "private",
      "Private workspace",
      "Your plans and activity logs are saved to your signed-in workspace.",
    ],
    [
      "preview",
      "Read-only demo",
      "Open the demo for a sample workspace you can explore without editing your own routines.",
      undefined,
      "/preview",
      "Open the demo",
    ],
    [
      "companion",
      "Your companion",
      "Drag me to either side. You can open this guide or turn off automatic tips whenever you like.",
    ],
  ]),
];

export const portfolioVisitorFeatures = group("Explore this portfolio", [
  [
    "sections",
    "Explore the portfolio",
    "Use the page navigation to jump to the published sections you want to read.",
  ],
  [
    "visitor-chat",
    "Ask about published work",
    "If you want, I can help you find information about the work and experience published here.",
  ],
  [
    "visitor-cv",
    "Download the public CV",
    "Looking for a copy? Use the portfolio’s CV download when it is available.",
  ],
  [
    "theme",
    "Change the page appearance",
    "Use the appearance control to switch the theme for your visit.",
  ],
  [
    "create",
    "Create a portfolio",
    "Want your own portfolio and CV? Visit MyDevStudio to see the layouts and get started.",
    undefined,
    "/",
    "Open MyDevStudio",
  ],
]);
