const nodes = [
  {
    title: "Start",
    route: "/start"
  },
  {
    title: "Person",
    route: "/person"
  },

  {
    title: "Three",
    route: "/threeviewer"
  },
  {
    title: "Skills",
    route: "/skills",
    children: [
      {
        title: "Add skill",
        route: "/skills/add"
      },
      {
        title: "Diagram",
        route: "/skills/diagram"
      }
    ]
  }
];

export { nodes };
