import { test, expect } from '@playwright/test';

test.describe('Task Management E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    //navigate to the task list page
    await page.goto('/tasks');

    //wait for the page to load
    await page.waitForSelector('app-filter', { timeout: 10000 });
    await page.waitForSelector('app-table', { timeout: 10000 });
  });

  test('Complete flow: filter, view, edit, and save task', async ({ page }) => {
    
    //1 -FILTER BY NAME

    //wait for the search input to be visible
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.waitFor({ state: 'visible' });

    //type "carlos" in the search field to filter by assignee name
    await searchInput.fill('carlos');

    //wait for debounce (300ms + margin)
    await page.waitForTimeout(400);

    //verify that the table has filtered results (should be less than total)
    const filteredRows = page.locator('table tbody tr');
    const rowCount = await filteredRows.count();

    //should have some results but less than the original count
    expect(rowCount).toBeGreaterThan(0);
    expect(rowCount).toBeLessThanOrEqual(10); // Assuming max 10 items per page

    //verify that Carlos Martinez appears in the filtered results
    await expect(filteredRows.first()).toContainText('Carlos Martinez');

    //2 - CLICK ON TASK TO OPEN DETAIL

    //click on the first task row in the table
    const firstTaskRow = page.locator('table tbody tr').first();

    //get the task ID before clicking
    const taskId = await firstTaskRow.locator('td').first().textContent();
    console.log('Opening task:', taskId);

    //click directly on the row to navigate to edit/detail page
    await firstTaskRow.click();

    //wait for navigation to task detail page
    await page.waitForURL(/\/tasks\/T-\d+/);


    //3 -VERIFY WE'RE ON THE EDIT PAGE

    //check that we're on the correct page
    await expect(
      page.locator('h2, h1').filter({ hasText: /Edit Task|Task #\d+|Update task details/ })
    ).toBeVisible();

    //4 - EDIT TASK FIELDS

    //edit Title
    const titleInput = page.locator('input[formControlName="title"], input[placeholder*="Title"]');
    await titleInput.waitFor({ state: 'visible' });
    await titleInput.clear();
    await titleInput.fill('Updated Task Title - E2E Test');

    //edit description
    const descriptionTextarea = page.locator(
      'textarea[formControlName="description"], textarea[placeholder*="Description"]'
    );
    await descriptionTextarea.clear();
    await descriptionTextarea.fill('This task was updated by E2E test automation');

    //change status
    const statusSelect = page.locator('mat-select[formControlName="status"]');
    await statusSelect.click();
    await page.locator('mat-option').filter({ hasText: 'In Progress' }).click();

    //change priority
    const prioritySelect = page.locator('mat-select[formControlName="priority"]');
    await prioritySelect.click();
    await page.locator('mat-option').filter({ hasText: 'High' }).click();

    //5 - SAVE CHANGES

    // Click the Update/Save button
    const saveButton = page.locator('button').filter({ hasText: /Update Task|Save|Update/ });
    await saveButton.click();

    //6 - VERIFY SUCCESS

    //check for success message (snackbar)
    const snackbar = page.locator(
      'mat-snack-bar, .mat-mdc-snack-bar-container, snack-bar-container'
    );
    await expect(snackbar).toContainText(/success|updated|saved/i, { timeout: 5000 });

    //verify we're redirected back to list or stay on detail page
    const currentUrl = page.url();
    if (currentUrl.includes('/tasks') && !currentUrl.includes('/T-')) {
      //if redirected to list, verify the updated task appears
      await page.waitForSelector('app-table');

      await page.locator('input[placeholder*="Search"]').fill('Updated Task Title - E2E Test');
      await page.waitForTimeout(400);

      //verify the updated task is in the list
      await expect(page.locator('table tbody tr')).toHaveCount(1);
      await expect(page.locator('table tbody tr').first()).toContainText(
        'Updated Task Title - E2E Test'
      );
    }
  });

  test('Filter by status and priority', async ({ page }) => {
    //filter by Status
    await page.locator('mat-form-field').filter({ hasText: 'Status' }).click();
    await page.locator('mat-option').filter({ hasText: 'In Progress' }).click();
    await page.keyboard.press('Escape');

    await page.waitForTimeout(500);

    //verify filtered results
    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    //add Priority filter
    await page.locator('mat-form-field').filter({ hasText: 'Priority' }).click();
    await page.locator('mat-option').filter({ hasText: 'High' }).click();
    await page.keyboard.press('Escape');

    await page.waitForTimeout(500);

    await page.locator('button').filter({ hasText: 'Clear Filters' }).click();

    //verify filters are cleared
    await expect(page.locator('input[placeholder*="Search"]')).toHaveValue('');
  });
});

//simple smoke test to ensure the app loads
test.describe('Smoke Tests', () => {
  test('should load the task list page', async ({ page }) => {
    await page.goto('/tasks');

    //main components are present?
    await expect(page.locator('app-filter')).toBeVisible();
    await expect(page.locator('app-table')).toBeVisible();
    await expect(page.locator('app-stats-cards')).toBeVisible();

    //header is present?
    await expect(page.locator('h1').filter({ hasText: 'Task Management' })).toBeVisible();

    //new Task button is present?
    await expect(page.locator('button').filter({ hasText: 'New Task' })).toBeVisible();
  });
});
