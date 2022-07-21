"use strict";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "layout",
    docs: {
      description: "require rule equal signs to be on the next line from the rule name",
      recommended: true,
      url: "TBD",
    },
    messages: {
      next: "Equal sign must be on next line from the rule name.",
      same: "Equal sign must be on the same line as rule name.",
    },
    fixable: null,
    schema: [
      {
        enum: ["always", "never", "choice"],
      },
    ],
  },
  create(context) {
    const style = context.options[0] || "choice";
    return {
      "rule": node => {
        const ruleLine = node.name.loc.start.line;
        const equalLine = node.equals.loc.start.line;

        switch (style) {
          case "always":
            if (ruleLine !== equalLine - 1) {
              context.report({
                node: node.equals,
                messageId: "next",
              });
            }
            break;
          case "never":
            if (ruleLine !== equalLine) {
              context.report({
                node: node.equals,
                messageId: "same",
              });
            }
            break;
          case "choice":
            if (node.expression.type === "choice") {
              if (ruleLine !== equalLine - 1) {
                context.report({
                  node: node.equals,
                  messageId: "next",
                });
              }
            } else {
              if (ruleLine !== equalLine) {
                context.report({
                  node: node.equals,
                  messageId: "same",
                });
              }
            }
            break;
          /* c8 ignore next */
          default:
            /* c8 ignore next */
            throw new Error(`Unknown style: '${style}'`);
        }
      },
    };
  },
};