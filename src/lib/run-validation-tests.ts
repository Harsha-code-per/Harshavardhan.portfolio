import { validateContactInput } from "./validation";
import assert from "assert";

function runTests() {
  console.log("🚀 Starting Contact Form Validation Unit Tests...");

  // Test 1: Valid input
  const res1 = validateContactInput({
    name: "John Doe",
    email: "john@example.com",
    message: "Hello Awwwards!"
  });
  assert.strictEqual(res1.isValid, true);
  console.log("✓ Test 1 Passed: Valid input approved.");

  // Test 2: Bot honeypot triggers block
  const res2 = validateContactInput({
    name: "John Doe",
    email: "john@example.com",
    message: "Hello Awwwards!",
    botField: "spambot"
  });
  assert.strictEqual(res2.isValid, false);
  assert.strictEqual(res2.error, "Transmission blocked by spam filter rules.");
  console.log("✓ Test 2 Passed: Honeypot triggers spam block.");

  // Test 3: Invalid email format
  const res3 = validateContactInput({
    name: "John Doe",
    email: "not-an-email",
    message: "Hello Awwwards!"
  });
  assert.strictEqual(res3.isValid, false);
  assert.strictEqual(res3.error, "Invalid email routing format.");
  console.log("✓ Test 3 Passed: Invalid email rejected.");

  // Test 4: Name length overflow
  const res4 = validateContactInput({
    name: "A".repeat(101),
    email: "john@example.com",
    message: "Hello Awwwards!"
  });
  assert.strictEqual(res4.isValid, false);
  assert.strictEqual(res4.error, "Name must be under 100 characters.");
  console.log("✓ Test 4 Passed: Overflowing name rejected.");

  // Test 5: Message length overflow
  const res5 = validateContactInput({
    name: "John Doe",
    email: "john@example.com",
    message: "A".repeat(5001)
  });
  assert.strictEqual(res5.isValid, false);
  assert.strictEqual(res5.error, "Message payload must be under 5000 characters.");
  console.log("✓ Test 5 Passed: Overflowing message payload rejected.");

  console.log("✨ All 5 security validation tests passed successfully!");
}

try {
  runTests();
} catch (error) {
  console.error("❌ Test failed:", error);
  process.exit(1);
}
