import type { Policy } from "@/types/content";

/**
 * Template policy copy.
 *
 * NOTE FOR IMPLEMENTERS: these are illustrative defaults for a template, not
 * legal advice. Replace the text with policies reviewed for your jurisdiction
 * before taking real orders.
 */
export const policies: Policy[] = [
  {
    slug: "shipping",
    title: "Shipping from the atelier",
    eyebrow: "Care",
    intro:
      "Pieces leave wrapped in cloth and board, as they would from a workshop. Below is what to expect between the bench and your door.",
    updatedAt: "2026-07-01",
    sections: [
      {
        heading: "Dispatch",
        body: [
          "Orders are prepared at the atelier within two working days. Each piece is photographed in its final condition before it is wrapped, and that photograph is attached to your dispatch note.",
          "Commissioned and made-to-order pieces follow the lead time quoted at the time of order, typically eight to sixteen weeks.",
        ],
      },
      {
        heading: "Transit times",
        body: [
          "Within India: three to six working days, tracked and insured.",
          "United Kingdom, European Union, United States, Canada, Australia and Singapore: ten to eighteen working days, tracked and insured. Customs clearance is the main variable.",
          "Elsewhere: written to you with a quote before dispatch.",
        ],
      },
      {
        heading: "Duties and taxes",
        body: [
          "Indian orders are inclusive of GST. International orders are shipped delivered-at-place: import duties and local taxes are assessed by the destination country and are payable by the recipient.",
          "We declare full value on every shipment. We do not under-declare goods, as doing so voids the transit insurance that protects your piece.",
        ],
      },
      {
        heading: "Packaging",
        body: [
          "Unbleached cotton, then board, then a fitted outer carton, with additional bracing for figures over three kilograms. The packing is plastic-free and designed to be reused for storage.",
        ],
      },
    ],
  },
  {
    slug: "returns",
    title: "Returns, rarely needed",
    eyebrow: "Care",
    intro:
      "Each object is photographed as it is, so what arrives should hold no surprises. If a piece is not right, here is how it is put right.",
    updatedAt: "2026-07-01",
    sections: [
      {
        heading: "The window",
        body: [
          "Unused pieces may be returned within fourteen days of delivery for a full refund of the item price.",
          "Because every figure is individually cast, we ask that it comes back in its original packing. If the packing has been discarded, write to us first and we will send replacement materials.",
        ],
      },
      {
        heading: "What is not a fault",
        body: [
          "Variation in chasing, patina depth and edge irregularity between your piece and the photograph is inherent to lost-wax casting and hand finishing. These are not defects and are not grounds for a fault return, though they remain covered by the ordinary fourteen-day window.",
          "Darkening after delivery is normal oxidation of unlacquered brass and is expected.",
        ],
      },
      {
        heading: "Damage in transit",
        body: [
          "Every shipment is insured. If a piece arrives damaged, photograph it in the packaging before unpacking further and write to the atelier within seventy-two hours. We arrange collection and either repair, replace or refund at your preference, at our cost.",
        ],
      },
      {
        heading: "Commissions",
        body: [
          "Commissioned pieces are made to your specification and are not returnable under the standard window, except where faulty. We share progress photographs at the wax and post-cast stages so the form can be adjusted before it is finished.",
        ],
      },
      {
        heading: "Repair",
        body: [
          "We re-finish and repair anything we have sold, for the life of the piece. Outside the return window this is charged at cost of labour and return carriage only.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    eyebrow: "Legal",
    intro:
      "What this site collects, why, and how to have it removed. Written to be read rather than skimmed.",
    updatedAt: "2026-07-01",
    sections: [
      {
        heading: "What we collect",
        body: [
          "If you write to the atelier or join the correspondence list, we hold the name, email address and message you supply.",
          "If you place an order request, we hold the delivery details and the items requested.",
          "Your cart and wishlist are stored in your own browser's local storage. They are never transmitted to us and are not readable by us.",
        ],
      },
      {
        heading: "What we do not do",
        body: [
          "We do not sell or rent personal data. We do not run third-party advertising trackers on this site. We do not build behavioural profiles.",
        ],
      },
      {
        heading: "Retention",
        body: [
          "Correspondence is kept for two years. Order records are kept for seven years, as tax law requires. Correspondence-list subscriptions are kept until you unsubscribe, which every message we send makes possible in one click.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You may request a copy of what we hold about you, ask for it to be corrected, or ask for it to be erased. Write to the atelier and we will respond within thirty days.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of sale",
    eyebrow: "Legal",
    intro:
      "The terms on which the atelier sells. Short, because the arrangement is simple.",
    updatedAt: "2026-07-01",
    sections: [
      {
        heading: "Orders",
        body: [
          "An order request placed through this site is an offer to buy, not a concluded contract. The contract forms when the atelier confirms the request in writing and the piece is allocated to you.",
          "We may decline a request — most often because a one-of-a-kind piece has already been allocated to another customer.",
        ],
      },
      {
        heading: "Prices",
        body: [
          "Prices are shown in Indian Rupees and include GST for Indian delivery. International orders are exclusive of destination duties and local taxes.",
          "Prices may change, but never for an order already confirmed.",
        ],
      },
      {
        heading: "Description of goods",
        body: [
          "Photographs are of representative pieces. Hand-cast and hand-finished objects vary within the ranges described on the product page and in our FAQs. Listed dimensions and weights are accurate to within five percent.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "Nothing in these terms limits liability for death, personal injury or fraud. Otherwise our liability in respect of any piece is limited to its purchase price.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          "These terms are governed by the laws of India, and the courts of New Delhi have exclusive jurisdiction, save that consumers retain the protection of mandatory rules in their country of residence.",
        ],
      },
    ],
  },
];
