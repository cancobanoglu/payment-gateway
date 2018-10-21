package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import play.libs.Json;
import play.mvc.*;

import javax.transaction.Transaction;
import java.util.Optional;
import java.util.UUID;

class StartPaymentResponse {
  public String url;
  public String txnId;

  public StartPaymentResponse(String url, String txnId) {
    this.url = url;
    this.txnId = txnId;
  }
}

class TransactionManager {

  public String newTransaction(String type) {
    // do stuff here
    return UUID.randomUUID().toString();
  }
}

class IntegrationService {

  public String getUrl(String type) {
    switch (type) {
      case "payu":
        return "http://localhost:9000/payu.html";
      case "cc":
        return "http://localhost:9000/cc.html";
    }
    // omitted
    return null;
  }
}

public class HomeController extends Controller {

  private IntegrationService integrationService;
  private TransactionManager transactionManager;

  public HomeController() {
    this.transactionManager = new TransactionManager();
    this.integrationService = new IntegrationService();
  }

  public Result startPayment(Optional<String> pType) {
    // check payment type
    System.out.println(integrationService.getUrl(pType.get()));

    String id = transactionManager.newTransaction(pType.get());

    JsonNode jsonNode = Json.toJson(new StartPaymentResponse(integrationService.getUrl(pType.get()), id));
    return ok(jsonNode).as("application/json");
  }
}

