const DEFAULT_HW_ACCEL_PREF = Services.prefs.getDefaultBranch(null).getBoolPref("layers.acceleration.disabled");
const DEFAULT_PROCESS_COUNT = Services.prefs.getDefaultBranch(null).getIntPref("dom.ipc.processCount");

add_task(function*() {
  yield SpecialPowers.pushPrefEnv({set: [
    ["layers.acceleration.disabled", DEFAULT_HW_ACCEL_PREF],
    ["dom.ipc.processCount", DEFAULT_PROCESS_COUNT],
    ["browser.preferences.defaultPerformanceSettings.enabled", true],
  ]});
});

add_task(function*() {
  let prefs = yield openPreferencesViaOpenPreferencesAPI("paneGeneral", null, {leaveOpen: true});
  is(prefs.selectedPane, "paneGeneral", "General pane was selected");

  let doc = gBrowser.selectedBrowser.contentDocument;
  let useRecommendedPerformanceSettings = doc.querySelector("#useRecommendedPerformanceSettings");

  is(Services.prefs.getBoolPref("browser.preferences.defaultPerformanceSettings.enabled"), true,
    "pref value should be true before clicking on checkbox");
  ok(useRecommendedPerformanceSettings.checked, "checkbox should be checked before clicking on checkbox");

  useRecommendedPerformanceSettings.click();

  let performanceSettings = doc.querySelector("#performanceSettings");
  is(performanceSettings.hidden, false, "performance settings section is shown");

  is(Services.prefs.getBoolPref("browser.preferences.defaultPerformanceSettings.enabled"), false,
     "pref value should be false after clicking on checkbox");
  ok(!useRecommendedPerformanceSettings.checked, "checkbox should not be checked after clicking on checkbox");

  let allowHWAccel = doc.querySelector("#allowHWAccel");
  let allowHWAccelPref = Services.prefs.getBoolPref("layers.acceleration.disabled");
  is(allowHWAccelPref, DEFAULT_HW_ACCEL_PREF,
    "pref value should be the default value before clicking on checkbox");
  is(allowHWAccel.checked, !DEFAULT_HW_ACCEL_PREF, "checkbox should show the invert of the default value");

  let contentProcessCount = doc.querySelector("#contentProcessCount");
  is(contentProcessCount.disabled, false, "process count control should be enabled");
  is(Services.prefs.getIntPref("dom.ipc.processCount"), DEFAULT_PROCESS_COUNT, "default pref value should be default value");
  is(contentProcessCount.selectedItem.value, DEFAULT_PROCESS_COUNT, "selected item should be the default one");

  let contentProcessCountEnabledDescription = doc.querySelector("#contentProcessCountEnabledDescription");
  is(contentProcessCountEnabledDescription.hidden, false, "process count enabled description should be shown");

  let contentProcessCountDisabledDescription = doc.querySelector("#contentProcessCountDisabledDescription");
  is(contentProcessCountDisabledDescription.hidden, true, "process count enabled description should be hidden");

  allowHWAccel.click();
  allowHWAccelPref = Services.prefs.getBoolPref("layers.acceleration.disabled");
  is(allowHWAccelPref, !DEFAULT_HW_ACCEL_PREF,
    "pref value should be opposite of the default value after clicking on checkbox");
  is(allowHWAccel.checked, !allowHWAccelPref, "checkbox should show the invert of the current value");

  contentProcessCount.value = 7;
  contentProcessCount.doCommand();
  is(Services.prefs.getIntPref("dom.ipc.processCount"), 7, "pref value should be 7");
  is(contentProcessCount.selectedItem.value, 7, "selected item should be 7");

  allowHWAccel.click();
  allowHWAccelPref = Services.prefs.getBoolPref("layers.acceleration.disabled");
  is(allowHWAccelPref, DEFAULT_HW_ACCEL_PREF,
    "pref value should be the default value after clicking on checkbox");
  is(allowHWAccel.checked, !allowHWAccelPref, "checkbox should show the invert of the current value");

  contentProcessCount.value = DEFAULT_PROCESS_COUNT;
  contentProcessCount.doCommand();
  is(Services.prefs.getIntPref("dom.ipc.processCount"), DEFAULT_PROCESS_COUNT, "pref value should be default value");
  is(contentProcessCount.selectedItem.value, DEFAULT_PROCESS_COUNT, "selected item should be default one");

  is(performanceSettings.hidden, false, "performance settings section should be still shown");

  Services.prefs.setBoolPref("browser.preferences.defaultPerformanceSettings.enabled", true);
  yield BrowserTestUtils.removeTab(gBrowser.selectedTab);
});

add_task(function*() {
  let prefs = yield openPreferencesViaOpenPreferencesAPI("paneGeneral", null, {leaveOpen: true});
  is(prefs.selectedPane, "paneGeneral", "General pane was selected");

  let doc = gBrowser.contentDocument;
  let useRecommendedPerformanceSettings = doc.querySelector("#useRecommendedPerformanceSettings");
  let allowHWAccel = doc.querySelector("#allowHWAccel");
  let contentProcessCount = doc.querySelector("#contentProcessCount");
  let performanceSettings = doc.querySelector("#performanceSettings");

  useRecommendedPerformanceSettings.click();
  allowHWAccel.click();
  contentProcessCount.value = 7;
  contentProcessCount.doCommand();
  useRecommendedPerformanceSettings.click();

  is(Services.prefs.getBoolPref("browser.preferences.defaultPerformanceSettings.enabled"), true,
    "pref value should be true before clicking on checkbox");
  ok(useRecommendedPerformanceSettings.checked, "checkbox should be checked before clicking on checkbox");
  is(performanceSettings.hidden, true, "performance settings section should be still shown");

  Services.prefs.setBoolPref("browser.preferences.defaultPerformanceSettings.enabled", true);
  yield BrowserTestUtils.removeTab(gBrowser.selectedTab);
});

add_task(function*() {
  let prefs = yield openPreferencesViaOpenPreferencesAPI("paneGeneral", null, {leaveOpen: true});
  is(prefs.selectedPane, "paneGeneral", "General pane was selected");

  let doc = gBrowser.contentDocument;
  let performanceSettings = doc.querySelector("#performanceSettings");

  is(performanceSettings.hidden, true, "performance settings section should not be shown");

  Services.prefs.setBoolPref("browser.preferences.defaultPerformanceSettings.enabled", false);

  is(performanceSettings.hidden, false, "performance settings section should be shown");

  Services.prefs.setBoolPref("browser.preferences.defaultPerformanceSettings.enabled", true);
  yield BrowserTestUtils.removeTab(gBrowser.selectedTab);
});

add_task(function*() {
  Services.prefs.setIntPref("dom.ipc.processCount", 7);

  let prefs = yield openPreferencesViaOpenPreferencesAPI("paneGeneral", null, {leaveOpen: true});
  is(prefs.selectedPane, "paneGeneral", "General pane was selected");

  let doc = gBrowser.contentDocument;

  let performanceSettings = doc.querySelector("#performanceSettings");
  is(performanceSettings.hidden, false, "performance settings section should be shown");

  let contentProcessCount = doc.querySelector("#contentProcessCount");
  is(Services.prefs.getIntPref("dom.ipc.processCount"), 7, "pref value should be 7");
  is(contentProcessCount.selectedItem.value, 7, "selected item should be 7");

  Services.prefs.setBoolPref("browser.preferences.defaultPerformanceSettings.enabled", true);
  yield BrowserTestUtils.removeTab(gBrowser.selectedTab);
});

add_task(function*() {
  Services.prefs.clearUserPref("dom.ipc.processCount");
  Services.prefs.setIntPref("dom.ipc.processCount.web", DEFAULT_PROCESS_COUNT + 1);
  Services.prefs.setBoolPref("browser.preferences.defaultPerformanceSettings.enabled", true);

  let prefs = yield openPreferencesViaOpenPreferencesAPI("paneGeneral", null, {leaveOpen: true});
  is(prefs.selectedPane, "paneGeneral", "General pane was selected");

  let doc = gBrowser.selectedBrowser.contentDocument;
  let useRecommendedPerformanceSettings = doc.querySelector("#useRecommendedPerformanceSettings");

  is(Services.prefs.getBoolPref("browser.preferences.defaultPerformanceSettings.enabled"), true,
    "pref value should be true before clicking on checkbox");
  ok(useRecommendedPerformanceSettings.checked, "checkbox should be checked before clicking on checkbox");

  useRecommendedPerformanceSettings.click();

  let performanceSettings = doc.querySelector("#performanceSettings");
  is(performanceSettings.hidden, false, "performance settings section is shown");

  is(Services.prefs.getBoolPref("browser.preferences.defaultPerformanceSettings.enabled"), false,
     "pref value should be false after clicking on checkbox");
  ok(!useRecommendedPerformanceSettings.checked, "checkbox should not be checked after clicking on checkbox");

  let contentProcessCount = doc.querySelector("#contentProcessCount");
  is(contentProcessCount.disabled, false, "process count control should be enabled");
  is(Services.prefs.getIntPref("dom.ipc.processCount"), DEFAULT_PROCESS_COUNT + 1, "e10s rollout value should be default value");
  is(contentProcessCount.selectedItem.value, DEFAULT_PROCESS_COUNT + 1, "selected item should be the default one");

  yield BrowserTestUtils.removeTab(gBrowser.selectedTab);

  Services.prefs.clearUserPref("dom.ipc.processCount");
  Services.prefs.clearUserPref("dom.ipc.processCount.web");
  Services.prefs.setBoolPref("browser.preferences.defaultPerformanceSettings.enabled", true);
});

add_task(function*() {
  Services.prefs.clearUserPref("dom.ipc.processCount");
  Services.prefs.setIntPref("dom.ipc.processCount.web", DEFAULT_PROCESS_COUNT + 1);
  Services.prefs.setBoolPref("browser.preferences.defaultPerformanceSettings.enabled", false);

  let prefs = yield openPreferencesViaOpenPreferencesAPI("paneGeneral", null, {leaveOpen: true});
  is(prefs.selectedPane, "paneGeneral", "General pane was selected");

  let doc = gBrowser.selectedBrowser.contentDocument;
  let performanceSettings = doc.querySelector("#performanceSettings");
  is(performanceSettings.hidden, false, "performance settings section is shown");

  let contentProcessCount = doc.querySelector("#contentProcessCount");
  is(contentProcessCount.disabled, false, "process count control should be enabled");
  is(Services.prefs.getIntPref("dom.ipc.processCount"), DEFAULT_PROCESS_COUNT, "default value should be the current value");
  is(contentProcessCount.selectedItem.value, DEFAULT_PROCESS_COUNT, "selected item should be the default one");

  yield BrowserTestUtils.removeTab(gBrowser.selectedTab);

  Services.prefs.clearUserPref("dom.ipc.processCount");
  Services.prefs.clearUserPref("dom.ipc.processCount.web");
  Services.prefs.setBoolPref("browser.preferences.defaultPerformanceSettings.enabled", true);
});

add_task(function*() {
  Services.prefs.setIntPref("dom.ipc.processCount", DEFAULT_PROCESS_COUNT + 2);
  Services.prefs.setIntPref("dom.ipc.processCount.web", DEFAULT_PROCESS_COUNT + 1);
  Services.prefs.setBoolPref("browser.preferences.defaultPerformanceSettings.enabled", false);

  let prefs = yield openPreferencesViaOpenPreferencesAPI("paneGeneral", null, {leaveOpen: true});
  is(prefs.selectedPane, "paneGeneral", "General pane was selected");

  let doc = gBrowser.selectedBrowser.contentDocument;
  let performanceSettings = doc.querySelector("#performanceSettings");
  is(performanceSettings.hidden, false, "performance settings section is shown");

  let contentProcessCount = doc.querySelector("#contentProcessCount");
  is(contentProcessCount.disabled, false, "process count control should be enabled");
  is(Services.prefs.getIntPref("dom.ipc.processCount"), DEFAULT_PROCESS_COUNT + 2, "process count should be the set value");
  is(contentProcessCount.selectedItem.value, DEFAULT_PROCESS_COUNT + 2, "selected item should be the set one");

  let useRecommendedPerformanceSettings = doc.querySelector("#useRecommendedPerformanceSettings");
  useRecommendedPerformanceSettings.click();

  is(Services.prefs.getBoolPref("browser.preferences.defaultPerformanceSettings.enabled"), true,
    "pref value should be true after clicking on checkbox");
  is(Services.prefs.getIntPref("dom.ipc.processCount"), DEFAULT_PROCESS_COUNT,
    "process count should be default value");

  yield BrowserTestUtils.removeTab(gBrowser.selectedTab);

  Services.prefs.clearUserPref("dom.ipc.processCount");
  Services.prefs.clearUserPref("dom.ipc.processCount.web");
  Services.prefs.setBoolPref("browser.preferences.defaultPerformanceSettings.enabled", true);
});

add_task(function*() {
  Services.prefs.setBoolPref("layers.acceleration.disabled", true);

  let prefs = yield openPreferencesViaOpenPreferencesAPI("paneGeneral", null, {leaveOpen: true});
  is(prefs.selectedPane, "paneGeneral", "General pane was selected");

  let doc = gBrowser.contentDocument;

  let performanceSettings = doc.querySelector("#performanceSettings");
  is(performanceSettings.hidden, false, "performance settings section should be shown");

  let allowHWAccel = doc.querySelector("#allowHWAccel");
  is(Services.prefs.getBoolPref("layers.acceleration.disabled"), true,
    "pref value is false");
  ok(!allowHWAccel.checked, "checkbox should not be checked");

  Services.prefs.setBoolPref("browser.preferences.defaultPerformanceSettings.enabled", true);
  yield BrowserTestUtils.removeTab(gBrowser.selectedTab);
});
