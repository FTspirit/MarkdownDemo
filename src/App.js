import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { exampleSetup } from "prosemirror-example-setup";
import { defaultMarkdownParser } from "prosemirror-markdown";
import axios from "axios";
import "./App.css";
import { useState, useEffect } from "react";
 
// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
function App() {
  const [data1, setData1] = useState(`null`);
  const getDocument = async () => {
    const response = await axios.post(
      "https://docs.lumi.vn/api/documents.info",
      {
        id: "ai-camera-hub-3lWoXWehrR",
        shareId: "55197b6c-30a8-4821-a1c1-2a1c72752122",
        apiVersion: 2,
      }
    );
    const data = await response.data;
    setData1(data.data.document.text);
  };
  useEffect(() => {
    getDocument();
  }, []);
  const reg =
    /\/api\/attachments\.redirect\?id=(?<id>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/gi;
  // Example POST method implementation:
  const ytbReg =
    /(?:https?:\/\/)?youtu\.?be(?:\.com)?(?:.*v=|v\/|\/)([a-zA-Z0-9_-]{11})$/i;
  async function replacer2(url = "") {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "no-cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        cookie:
          "lastSignedIn=email; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRlNTUwOTM2LTQ4NDctNDMxMS04NjYxLTZjMjM3MDU4NTNhYiIsInR5cGUiOiJzZXNzaW9uIiwiaWF0IjoxNjcxNzYxMzcxfQ.xfORUG2PvmYr1pKDq00JfnDRWvh7x4PEvsLbmLGHk6U",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response; // parses JSON response into native JavaScript objects
  }
  const newStr = data1.replace(
    reg,
    // "https://api.storage.docz.lumi.vn/outline/uploads/99e65ded-bce4-4e3d-b48a-5024f2c0e381/bb9674f0-79fe-4134-8ffe-f8746622dd11/reset.png"
    replacer2(
      "https://docs.lumi.vn/api/attachments.redirect?id=f2136f3e-6ea3-4ef5-a573-da529ed7886b"
    ).then((data) => {
      console.log(data); // JSON data parsed by `data.json()` call
    })
  );
  const newStr2 = data1.replace(ytbReg, 454545454545);
  console.log(`newStr2`, newStr2);
  console.log(`spec.nodes`, schema.spec.nodes);
  console.log(addListNodes(schema.spec.nodes, "paragraph block*", "block"));
  console.log(`spec.marks`, schema.spec.marks);
  const mySchema = new Schema({
    nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
    marks: schema.spec.marks,
  });
  let starSchema = new Schema({
    nodes: {
      text: {
        group: "inline",
      },
      star: {
        inline: true,
        group: "inline",
        toDOM() {
          return ["star", "🟊"];
        },
        parseDOM: [{ tag: "star" }],
      },
      paragraph: {
        group: "block",
        content: "inline*",
        toDOM() {
          return ["p", 0];
        },
        parseDOM: [{ tag: "p" }],
      },
      boring_paragraph: {
        group: "block",
        content: "text*",
        marks: "",
        toDOM() {
          return ["p", { class: "boring" }, 0];
        },
        parseDOM: [{ tag: "p.boring", priority: 60 }],
      },
      doc: {
        content: "block+",
      },
      marks: {
        shouting: {
          toDOM() {
            return ["shouting", 0];
          },
          parseDOM: [{ tag: "shouting" }],
        },
        link: {
          attrs: { href: {} },
          toDOM(node) {
            return ["a", { href: node.attrs.href }, 0];
          },
          parseDOM: [
            {
              tag: "a",
              getAttrs(dom) {
                return { href: dom.href };
              },
            },
          ],
          inclusive: false,
        },
      },
    },
  });

  console.log(defaultMarkdownParser.parse(`${newStr}`));
  console.log(exampleSetup({ schema: mySchema }));
  window.view = new EditorView(document.querySelector("#editor"), {
    state: EditorState.create({
      doc: defaultMarkdownParser.parse(`${newStr}`),
      plugins: exampleSetup({ schema: starSchema }),
    }),
  });
  return (
    <div className="App">
      <div id="editor" />
      <p id="boring">Test</p>
    </div>
  );
}
export default App;
