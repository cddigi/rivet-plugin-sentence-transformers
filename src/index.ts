// It is important that you only import types from @ironclad/rivet-core, and not
// any of the actual Rivet code. Rivet is passed into the initializer function as
// a parameter, and you can use it to access any Rivet functionality you need.
import type { RivetPlugin, RivetPluginInitializer } from "@ironclad/rivet-core";

import { sentenceTransformersPluginNode } from "./nodes/SentenceTransformersPluginNode.js";

// A Rivet plugin must default export a plugin initializer function. This takes in the Rivet library as its
// only parameter. This function must return a valid RivetPlugin object.
const plugin: RivetPluginInitializer = (rivet) => {
  // Initialize any nodes in here in the same way, by passing them the Rivet library.
  const sentenceTransformersNode = sentenceTransformersPluginNode(rivet);

  // The plugin object is the definition for your plugin.
  const sentenceTransformersPlugin: RivetPlugin = {
    // The ID of your plugin should be unique across all plugins.
    id: "sentenceTransformers-plugin",

    // The name of the plugin is what is displayed in the Rivet UI.
    name: "Sentence Transformers Plugin",

    // Define all configuration settings in the configSpec object.
    configSpec: {
      sentenceTransformerSetting: {
        type: "string",
        label: "Sentence Transformers Setting",
        description:
          "This is an example setting for the sentenceTransformers plugin.",
        helperText:
          "This is an example setting for the sentenceTransformers plugin.",
      },
    },

    // Define any additional context menu groups your plugin adds here.
    contextMenuGroups: [
      {
        id: "sentenceTransformers",
        label: "Sentence Transformers",
      },
    ],

    // Register any additional nodes your plugin adds here. This is passed a `register`
    // function, which you can use to register your nodes.
    register: (register) => {
      register(sentenceTransformersNode);
    },
  };

  // Make sure to return your plugin definition.
  return sentenceTransformersPlugin;
};

// Make sure to default export your plugin.
export default plugin;
