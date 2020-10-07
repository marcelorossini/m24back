
const axios = require("axios").default;

const { generateUrlName } = require("../helpers");

module.exports = {
  async createCustomers(params) {
    return post("https://api.iugu.com/v1/customers", params);
  },
  async createPaymentToken(params) {
    const {
      number,
      verification_value,
      first_name,
      last_name,
      month,
      year,
    } = params;
    return post("https://api.iugu.com/v1/payment_token", {
      data: {
        number,
        verification_value,
        first_name,
        last_name,
        month,
        year,
      },
      account_id: "88DD0F7517A9F644071BFE787B0E5250",
      method: "credit_card",
      test: true,
    });
  },
  async createPaymentMethod(params) {
    const { user, token, description } = params;
    return post(`https://api.iugu.com/v1/customers/${user}/payment_methods`, {
      token,
      description,
      set_as_default: true,
    });
  },
  async createPlan(params) {
    const { name, price } = params;
    const identifier = generateUrlName(name);

    const plan = await get(`https://api.iugu.com/v1/plans/identifier/${identifier}`)
    
    let response = {};
    if (plan.hasOwnProperty("id")) {      
      response = await put(`https://api.iugu.com/v1/plans/${plan.id}`, {
        value_cents: price  * 100,
      });
    } else {
      response = await post("https://api.iugu.com/v1/plans", {
        name: name,
        identifier: identifier,
        interval: 1,
        interval_type: "months",
        value_cents: price * 100,
      });
    }
    return response;
  },
  async createSubscription(params) {
    const { user, plan, payable_with } = params;
    return post("https://api.iugu.com/v1/subscriptions", {
      two_step: false,
      suspend_on_invoice_expired: false,
      only_charge_on_due_date: false,
      customer_id: user,
      only_on_charge_success: false,
      payable_with,
      plan_identifier: plan,
    });
  },
};

const post = (url, json) => {
  return axios
    .post(url, json, {
      auth: {
        username: "f9c20677ea63f0e068e03fcf1e050d6c",
        password: "",
      },
    })
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      return err.response.data;
    });
};


const put = (url, json) => {
  return axios
    .put(url, json, {
      auth: {
        username: "f9c20677ea63f0e068e03fcf1e050d6c",
        password: "",
      },
    })
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      return err.response.data;
    });
};

const get = (url, params) => {
  return axios
    .get(url, {
      params: { api_token: "f9c20677ea63f0e068e03fcf1e050d6c"}
    })
    .then((result) => {
      return result.data;
    })
    .catch((err) => {
      return err.response.data;
    });
};