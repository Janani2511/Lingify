# Lingify — Sample Data and Test Cases

**Document Version:** 1.0  
**Status:** Initial Test Plan

## 1. Purpose

This document contains representative sample inputs and test cases for validating Lingify's multilingual accessibility features.

The expected results below are illustrative. Actual results must be verified against the transliteration engine, OCR engine, speech service, and AI service selected for implementation.

## 2. Sample Data

| Test ID | Feature | Sample Input | Expected Behavior |
|---|---|---|---|
| SD01 | Text input | `Vanakkam` | Accept the text as input |
| SD02 | Text input | Empty string | Display an input validation message if text is required |
| SD03 | Language selection | Supported source and target scripts | Accept the selected options |
| SD04 | Language selection | Unsupported language | Display a clear unsupported-language message |
| SD05 | OCR | Image containing readable text | Extract and display text when OCR is implemented |
| SD06 | OCR | Invalid or unsupported file | Reject the file with a clear message |
| SD07 | Voice | Clear spoken sentence | Return recognized text when speech recognition is implemented |
| SD08 | AI assistant | A simple language-related question | Display a response when the AI service is configured |

## 3. Functional Test Cases

| Test ID | Test Scenario | Steps | Expected Result |
|---|---|---|---|
| TC01 | Open home page | Launch the application | Home page loads without a blank screen |
| TC02 | Navigate between pages | Select each available navigation item | The correct page or clearly labelled placeholder appears |
| TC03 | Submit text | Enter text into an implemented text input | Input is accepted |
| TC04 | Empty input | Submit without entering required text | A validation message appears |
| TC05 | Transliteration | Enter text and select supported scripts | The engine returns a result in the target script |
| TC06 | Unsupported language | Select an unsupported language | The application handles the selection gracefully |
| TC07 | OCR image upload | Upload a supported image | Extracted text appears when OCR is integrated |
| TC08 | Invalid image upload | Upload an unsupported file | The file is rejected with a helpful message |
| TC09 | Voice input | Provide voice input with permission | Recognized text appears when voice processing is integrated |
| TC10 | AI assistance | Submit a valid question | A response appears when the AI service is configured |
| TC11 | Network failure | Disconnect the network during an API request | A useful error message appears |
| TC12 | Responsive layout | Open the application on a narrow screen | Content remains readable and usable |

## 4. Transliteration Test Examples

The following are illustrative examples, not verified outputs from an implemented engine.

| Test ID | Input | Source | Target | Expected Result |
|---|---|---|---|---|
| TR01 | `Vanakkam` | Roman Tamil | Tamil script | Equivalent Tamil-script representation |
| TR02 | `Namaste` | Roman Hindi | Devanagari | Equivalent Devanagari representation |
| TR03 | `Hello` | English | English | Input remains unchanged if identity conversion is supported |
| TR04 | Empty input | Any supported option | Any supported option | Validation message if input is required |

Transliteration is different from translation. For example, converting a Romanized Tamil word into Tamil script changes its writing system rather than translating its meaning into English.

## 5. Negative Testing

- Empty or whitespace-only input.
- Extremely long text input.
- Unsupported language selection.
- Corrupted image upload.
- Image exceeding the configured size limit.
- Microphone permission denied.
- API timeout or unavailable service.
- Unexpected server response.

The application should handle these cases without crashing or exposing sensitive information.

## 6. Test Execution Record

Record the actual result after testing each implemented feature.

| Test ID | Actual Result | Status | Remarks |
|---|---|---|---|
| TC01 | To be tested | Not run | |
| TC02 | To be tested | Not run | |
| TC03 | To be tested | Not run | |
| TC04 | To be tested | Not run | |
| TC05 | To be tested | Not run | |
| TC06 | To be tested | Not run | |
| TC07 | To be tested | Not run | |
| TC08 | To be tested | Not run | |
| TC09 | To be tested | Not run | |
| TC10 | To be tested | Not run | |

**Status definitions:**
- **Pass:** Actual behavior matches the expected result.
- **Fail:** Actual behavior differs from the expected result.
- **Not run:** Testing has not yet been performed.
- **Blocked:** Testing cannot proceed because a dependency is unavailable.

## 7. Conclusion

These test cases provide an initial framework for evaluating Lingify. Update the test data and execution records as features are implemented and verified.
