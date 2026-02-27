# Expected JSON Structure

The application expects a JSON array containing objects that represent individual questions. This can be provided either by uploading a `.json` file or by pasting text containing a JavaScript variable assignment (e.g., `var questionList = [ ... ];`).

## Overall Format

The root element must be a JSON Array:
```json
[
  {
    // Question 1 Object
  },
  {
    // Question 2 Object
  }
]
```

## Question Object Properties

Each question object in the array should have the following structure. Fields marked as **Required** are actively used by the parsing logic to render the UI.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | Number / String | Yes | Unique identifier for the question. Displayed in the question meta tag. |
| `mock_Test_Name` | String | No | Title of the test. Only read from the first question (`questions[0]`). Defaults to "Questionnaire" if not provided. |
| `main_question` | String (HTML) | Yes | The actual question text. Can include HTML formatting (e.g., `<p>`, `<strong>`). |
| `options` | Array of Strings | Yes | An array of possible answer options. The application will render these as A, B, C, D, etc. |
| `correct_answer` | String / Number | Yes | The zero-based index of the correct option in the `options` array. (e.g., `"0"` for A, `"1"` for B). Must be parsable by `parseInt()`. |
| `answer_solution_english` | String (HTML) | Yes | The detailed reasoning or solution for the question, shown when the solution is toggled. Can include HTML. |
| `ai_analysis` | String (HTML) | No | Optional deeper AI analysis of the question and options. If present, it creates an additional "AI ANALYSIS" panel. |
| `subject_name` | String | No | Subject categorization (not actively rendered in the UI, but present in sample data). |
| `difficulty_level` | String | No | Difficulty level of the question (e.g., "Moderate", "Easy"). Not actively rendered, but good for metadata. |

## Example Data

Here is a minimal valid example of what the parsed structure should look like:

```json
[
  {
    "id": 101,
    "mock_Test_Name": "Legal Practice Test 1",
    "main_question": "<p>When is oral evidence permissible under the Evidence Act?</p>",
    "options": [
      "In all cases without exception",
      "Only for proving contents of documents",
      "For all facts, except contents of documents",
      "Only when documentary evidence is lost"
    ],
    "correct_answer": "2",
    "answer_solution_english": "<p>Oral evidence can prove all facts except contents of documents.</p>",
    "ai_analysis": "<p>Detailed breakdown of the relevant sections explaining why options 0, 1, and 3 are incorrect.</p>"
  }
]
```

## Parsing Notes for Pasted Text

If pasting text directly into the input view, the JavaScript regex parser expects to find the array assigned to a variable named `questionList` using `var` and ending with either a semicolon or not.

**Supported patterns:**
```javascript
// Preferred
var questionList = [ ... ];

// Fallback (no semicolon)
var questionList = [ ... ]
```
The content within `[ ... ]` must be valid, stringified JSON.
