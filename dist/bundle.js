// src/nodes/SentenceTransformersPluginNode.ts
function sentenceTransformersPluginNode(rivet) {
  const SentenceTransformersPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          embeddings: [],
          strArray: [],
          useStrArrayInput: false
        },
        // This is the default title of your node.
        title: "Sentence-Transformers Plugin Node",
        // This must match the type of your node.
        type: "sentenceTransformersPluginNode",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useStrArrayInput) {
        inputs.push({
          id: "strArray",
          dataType: "string[]",
          title: "Paths"
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "embeddings",
          dataType: "vector[]",
          title: "Embeddings"
        }
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "Sentence-Transformers Plugin",
        group: "Data",
        infoBoxBody: "This is a sentence-transformer plugin node.",
        infoBoxTitle: "Sentence-Transformers Plugin Node"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "stringList",
          dataKey: "strArray",
          useInputToggleDataKey: "useStrArrayInput",
          label: "String List"
        }
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return rivet.dedent`
        Sentence-Transformers Plugin Node
        Embeddings: ${data.embeddings}
      `;
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const strArray = rivet.getInputOrData(
        data,
        inputData,
        "strArray",
        "string[]"
      );
      const sentenceTransformers = await SentenceTransformers.from_pretrained(
        "mixedbread-ai/mxbai-embed-large-v1"
      );
      const embeddings = await sentenceTransformers.encode(strArray);
      return {
        ["embeddings"]: {
          type: "vector[]",
          value: embeddings
        }
      };
    }
  };
  const SentenceTransformersPluginNode = rivet.pluginNodeDefinition(
    SentenceTransformersPluginNodeImpl,
    "Sentence-Transformers Plugin Node"
  );
  return SentenceTransformersPluginNode;
}

// src/index.ts
var plugin = (rivet) => {
  const sentenceTransformersNode = sentenceTransformersPluginNode(rivet);
  const sentenceTransformersPlugin = {
    // The ID of your plugin should be unique across all plugins.
    id: "sentenceTransformers-plugin",
    // The name of the plugin is what is displayed in the Rivet UI.
    name: "Sentence Transformers Plugin",
    // Define all configuration settings in the configSpec object.
    configSpec: {
      sentenceTransformerSetting: {
        type: "string",
        label: "Sentence Transformers Setting",
        description: "This is an example setting for the sentenceTransformers plugin.",
        helperText: "This is an example setting for the sentenceTransformers plugin."
      }
    },
    // Define any additional context menu groups your plugin adds here.
    contextMenuGroups: [
      {
        id: "sentenceTransformers",
        label: "Sentence Transformers"
      }
    ],
    // Register any additional nodes your plugin adds here. This is passed a `register`
    // function, which you can use to register your nodes.
    register: (register) => {
      register(sentenceTransformersNode);
    }
  };
  return sentenceTransformersPlugin;
};
var src_default = plugin;
export {
  src_default as default
};
