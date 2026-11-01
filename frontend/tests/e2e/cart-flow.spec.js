import { test, expect } from "@playwright/test";

test.describe("Full E2E Cart Flow & State Persistence", () => {
  test("complete cart lifecycle across reloads and route changes without hydration errors", async ({
    page,
  }) => {
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Mở trang danh sách sản phẩm
    await page.goto("/product");
    await expect(page).toHaveTitle(/KOVIQO/i);

    // Chờ sản phẩm xuất hiện
    const addButtons = page.locator("button.dat-hang");
    await expect(addButtons.first()).toBeVisible({ timeout: 10000 });

    // 2. Thêm sản phẩm đầu tiên vào giỏ hàng
    await addButtons.first().click();

    // 3. Kiểm tra Header Cart Badge cập nhật lên ít nhất 1
    const cartHeader = page.locator("a[href*='cart']").first();
    await expect(cartHeader).toContainText(/1\s+Giỏ hàng/);

    // 4. Chuyển sang trang /cart
    await cartHeader.click();
    await expect(page).toHaveURL(/\/cart/);

    // Xác minh bảng giỏ hàng hiển thị đúng 1 dòng sản phẩm
    const cartRows = page.locator("tbody tr");
    await expect(cartRows.first()).toBeVisible();

    const qtyInput = page.locator("input[type='number']").first();
    await expect(qtyInput).toHaveValue("1");

    // 5. Thay đổi số lượng sản phẩm lên 3
    await qtyInput.fill("3");
    await expect(qtyInput).toHaveValue("3");

    // 6. Reload trình duyệt (F5)
    await page.reload();
    await expect(page).toHaveURL(/\/cart/);

    // 7. Xác minh dữ liệu giỏ hàng được khôi phục chính xác từ localStorage
    const qtyInputAfterReload = page.locator("input[type='number']").first();
    await expect(qtyInputAfterReload).toHaveValue("3");
    await expect(cartHeader).toContainText(/3\s+Giỏ hàng/);

    // 8. Chuyển qua lại giữa các trang (Navigation test)
    await page.goto("/product");
    await expect(cartHeader).toContainText(/3\s+Giỏ hàng/);

    await page.goto("/cart");
    await expect(qtyInputAfterReload).toHaveValue("3");

    // 9. Xóa sản phẩm khỏi giỏ hàng
    const deleteButton = page.locator("button.btn-danger", { hasText: "Xóa" }).first();
    await deleteButton.click();

    // 10. Xác nhận giỏ hàng trống
    await expect(page.locator("text=Giỏ hàng của bạn đang trống")).toBeVisible();
    await expect(cartHeader).toContainText(/0\s+Giỏ hàng/);

    // 11. Reload và xác nhận trạng thái rỗng vẫn duy trì bền vững
    await page.reload();
    await expect(page.locator("text=Giỏ hàng của bạn đang trống")).toBeVisible();
    await expect(cartHeader).toContainText(/0\s+Giỏ hàng/);

    // 12. Kiểm tra không có lỗi console nghiêm trọng hoặc hydration warnings
    const severeErrors = consoleErrors.filter(
      (err) =>
        err.includes("Hydration failed") ||
        err.includes("Text content does not match") ||
        err.includes("Uncaught Error")
    );
    expect(severeErrors).toEqual([]);
  });
});

