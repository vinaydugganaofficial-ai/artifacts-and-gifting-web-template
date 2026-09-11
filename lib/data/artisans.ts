import type { Artisan } from "@/types/content";

export const artisans: Artisan[] = [
  {
    slug: "ramesh-kumar",
    name: "Ramesh Kumar",
    craft: "Casting & chasing",
    region: "Moradabad, Uttar Pradesh",
    yearsActive: 34,
    portrait: "/images/artisan-portrait.jpg",
    portraitAlt: "Ramesh Kumar at his workbench holding a small brass figure",
    summary:
      "Third-generation caster working the large devotional forms — Nataraja, Vishnu, the standing Shiva.",
    story: [
      "Ramesh learned the trade from his father in a workshop three streets from where he still works. The building has changed; the anvil has not. He casts the tall figures — the ones that need a steady pour and a steadier nerve, because a hesitation in the wrist shows up forty minutes later as a flaw in the aureole.",
      'He works to the old proportional canons but does not treat them as a cage. "A rule tells you where the shoulder goes," he says. "It does not tell you what the face is thinking." The faces are the part he finishes last, and alone.',
      "His workshop takes on two apprentices a year. Both are currently his nieces.",
    ],
    productSlugs: ["brass-nataraja"],
  },
  {
    slug: "imran-ali",
    name: "Imran Ali",
    craft: "Patina & surface",
    region: "Moradabad, Uttar Pradesh",
    yearsActive: 21,
    portrait: "/images/making/finish.jpg",
    portraitAlt: "Imran Ali burnishing the surface of a brass sculpture",
    summary:
      "Specialist in aged finishes — the dark recesses and lifted highlights that make new brass read as inherited.",
    story: [
      "Imran does not polish. He describes his work as deciding where the light is allowed to land. A piece leaves his bench with its high points bright and its hollows deliberately dark, which is how brass looks after fifty years in a house that uses it.",
      'The technique is chemical and mechanical in equal measure, and he is candid that most of it is timing. "Ten minutes too long and you have made an antique nobody believes in."',
      "He is the reason our Ganesha ships with its patina intact rather than buffed away.",
    ],
    productSlugs: ["antique-brass-ganesha"],
  },
  {
    slug: "lakshmi-bai",
    name: "Lakshmi Bai",
    craft: "Lost-wax bronze",
    region: "Swamimalai, Tamil Nadu",
    yearsActive: 28,
    portrait: "/images/making/shape.jpg",
    portraitAlt: "Lakshmi Bai shaping a wax model by hand",
    summary:
      "Works in the Swamimalai lost-wax tradition, building each figure in wax before a single gram of metal is poured.",
    story: [
      "In Swamimalai the model is made in wax and then destroyed — the mould is broken to release the casting, so every piece is by definition unique. Lakshmi Bai has been building these models since she was nineteen.",
      'Her lamps are functional first. The vessel is sized to hold enough oil for a full evening, and the wick channel is cut so the flame sits where it can be seen from the doorway. "An object for the threshold should be visible from the threshold," she says.',
      "She is one of a small number of women running their own furnace in the town.",
    ],
    productSlugs: ["brass-deepalakshmi"],
  },
  {
    slug: "suresh-achari",
    name: "Suresh Achari",
    craft: "Detail chasing",
    region: "Swamimalai, Tamil Nadu",
    yearsActive: 41,
    portrait: "/images/making/refine.jpg",
    portraitAlt: "Suresh Achari cutting fine detail into a brass crown",
    summary:
      "Cuts jewellery, crowns and inscription by chisel — the work that separates a cast figure from a finished one.",
    story: [
      "Suresh works with about sixty chisels, most of which he made himself. The finest are reground from broken ones. He uses them to cut the peacock feathers, the anklets, the beaded edge of a crown — details that a mould can suggest but cannot resolve.",
      'It is slow. A crown can take two days. He has no interest in speeding it up, and says so plainly: "If it were quick it would look quick."',
    ],
    productSlugs: ["traditional-krishna-idol"],
  },
  {
    slug: "farida-begum",
    name: "Farida Begum",
    craft: "Raising & hammer work",
    region: "Moradabad, Uttar Pradesh",
    yearsActive: 17,
    portrait: "/images/collections/craft.jpg",
    portraitAlt: "Farida Begum raising a brass lamp on the anvil",
    summary:
      "Raises lamps and vessels from flat sheet on the anvil, leaving the hammer facets visible.",
    story: [
      "Nothing Farida makes is cast. Each lamp starts as a flat disc of brass and is raised over a stake with a hammer, thousands of blows, until it holds its shape. The facets left behind are not sanded out — they are the record of how the object was made.",
      "She works to commission for temples as well as for us, and the two orders are made identically.",
    ],
    productSlugs: ["handcrafted-brass-diya-set"],
  },
  {
    slug: "vikram-singh",
    name: "Vikram Singh",
    craft: "Bell founding",
    region: "Jaipur, Rajasthan",
    yearsActive: 25,
    portrait: "/images/making/cast.jpg",
    portraitAlt: "Vikram Singh pouring metal for a bell casting",
    summary:
      "Tunes bells by wall thickness alone, finishing each one by ear rather than by gauge.",
    story: [
      "A bell's note comes from its geometry, and Vikram tunes his by removing metal from the inside wall until the pitch sits where he wants it. He does this by ear. There is no tuning fork in the workshop.",
      "He leaves the lip very slightly irregular. Perfectly round bells, he points out, are a modern industrial habit and not what a temple bell has ever sounded like.",
    ],
    productSlugs: ["traditional-temple-bell"],
  },
];
