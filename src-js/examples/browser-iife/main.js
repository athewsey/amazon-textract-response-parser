/**
 * Browser Javascript for main.html to demonstrate using TRP.js via IIFE <script> tag.
 *
 * This script assumes the TRP.js IIFE bundle has already been included (e.g. via another <script>
 * tag), to define the global `trp` object.
 *
 * Basic initial tests run as soon as the script is executed, but we can only demonstrate loading
 * a Textract JSON once the HTML file input is updated, which will trigger `onFileUpload()`.
 */

// Set a global flag which will be polled by Puppeteer to determine when the tests have succeeded:
window.fileProcessed = false;

// Run initial tests that don't require the Textract JSON:
console.log("Checking sub-module components are accessible through IIFE...");
const CHILD = trp.api.base.ApiRelationshipType.Child;
const ApiTextType = trp.api.content.ApiTextType;
const ApiKeyValueEntityTypeEnum = trp.api.form.ApiKeyValueEntityType;
const ApiJobStatus = trp.api.response.ApiJobStatus;
const ApiTableEntityType = trp.api.table.ApiTableEntityType;
const aggregate = trp.base.aggregate;
const Word = trp.content.Word;
const TexDoc = trp.document.TextractDocument;
const TexExp = trp.expense.TextractExpense;
const FormGeneric = trp.form.FormGeneric;
const Geometry = trp.geometry.Geometry;
const TexId = trp.id.TextractIdentity;
const QueryResultGeneric = trp.query.QueryResultGeneric;
const TableGeneric = trp.table.TableGeneric;
console.log("Testing aggregate() utility function...");
const aggTest = aggregate([1, 2, 3, 4], trp.base.AggregationMethod.Mean);
if (aggTest !== 2.5) {
  throw new Error(`Expected trp.base.aggregate([1, 2, 3, 4], "MEAN") to return 2.5: Got ${aggTest}`);
}

/**
 * Demonstrate basic parsing and analysis of a Textract response JSON with TRP
 *
 * @param {string} textractJsonStr
 */
function parseDocResult(textractJsonStr) {
  console.log("Loading Amazon Textract response JSON with TRP...");
  const doc = new trp.TextractDocument(JSON.parse(textractJsonStr));

  console.log(`Got ${doc.nPages} pages`);
  console.log("Testing getLineClustersInReadingOrder()");
  doc.pageNumber(1).getLineClustersInReadingOrder();

  console.log("Marking tests finished");
  window.fileProcessed = true;
}

/**
 * Extract JSON content when user selects a file, and call `parseDocResult()` with it.
 *
 * @param {HTMLInputElement} fileInput The type="file" input that generated the event
 */
function onFileUpload(fileInput) {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      parseDocResult(evt.target.result);
    };
    reader.onerror = (err) => {
      throw err;
    };
    reader.readAsText(file, "UTF-8");
  } else {
    throw new Error("No JSON file selected");
  }
}
