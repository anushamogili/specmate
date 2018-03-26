package com.specmate.test.integration;

import javax.ws.rs.core.Response.Status;

import org.json.JSONObject;
import org.junit.Assert;
import org.junit.Test;

import com.specmate.common.RestResult;
import com.specmate.model.administration.AdministrationPackage;

public class AdministrationTest extends EmfRestTest {

	public AdministrationTest() throws Exception {
		super();
	}

	private JSONObject getStatusObject(String mode) {
		JSONObject maintenandeStatus = new JSONObject();
		maintenandeStatus.put(NSURI_KEY, AdministrationPackage.eNS_URI);
		maintenandeStatus.put(ECLASS, AdministrationPackage.Literals.STATUS.getName());
		maintenandeStatus.put(AdministrationPackage.Literals.STATUS__VALUE.getName(), mode);
		return maintenandeStatus;
	}

	private void enterMode(String mode) {
		JSONObject status = getStatusObject(mode);
		String statusUrl = buildUrl("status");
		RestResult<JSONObject> result = restClient.post(statusUrl, status);
		Assert.assertEquals(Status.OK.getStatusCode(), result.getResponse().getStatus());
	}

	private void enterMaintenanceMode() {
		enterMode("maintenance");
	}

	private void enterNormalMode() {
		enterMode("normal");
	}

	private void checkIsInMode(String mode) {
		String url = buildUrl("status");
		JSONObject status = getObjectByUrl(Status.OK.getStatusCode(), url);
		Assert.assertEquals(status.get(AdministrationPackage.Literals.STATUS__VALUE.getName()), mode);
	}

	private void checkIsInMaintenanceMode() {
		checkIsInMode("maintenance");
	}

	private void checkIsInNormalMode() {
		checkIsInMode("normal");
	}

	@Test
	public void testMaintenanceMode() {
		JSONObject folder = postFolderToRoot();
		String folderId = getId(folder);
		enterMaintenanceMode();
		checkIsInMaintenanceMode();
		// check if read is still possible
		getObject(folderId);
		// check if write access leads to an exception
		JSONObject folder2 = createTestFolder();
		postObject(Status.FORBIDDEN.getStatusCode(), folder2);

		enterNormalMode();
		checkIsInNormalMode();
		postFolderToRoot();

	}

}
