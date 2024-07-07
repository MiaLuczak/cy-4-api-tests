describe('General httpbin API tests', () => {
  it('Get HTML main page', () => {
    cy.request('https://httpbin.org/').then((response) =>
      assert.equal(200, response.status)
    );
  });
  it('2s Deleyed response', () => {
    const delay = 2;
    cy.request(`https://httpbin.org/delay/${delay}`).then((response) => {
      expect(response.duration).to.satisfy((duration) => duration >= delay);
    });
  });
});

describe('Requests formats tests', () => {
  const baseURL = 'https://httpbin.org';

  it('HTML response format', () => {
    const request = {
      method: 'GET',
      url: `${baseURL}/html`,
      headers: {
        Accept: 'text/html',
      },
    };
    cy.request(request).then((response) => {
      expect(response.headers).to.have.property('content-type');
      expect(response.headers['content-type']).to.include(
        request.headers['Accept']
      );
    });
  });

  it('JSON response format', () => {
    const request = {
      method: 'GET',
      url: `${baseURL}/json`,
      headers: {
        Accept: 'application/json',
      },
    };
    cy.request(request).then((response) => {
      expect(response.headers).to.have.property('content-type');
      expect(response.headers['content-type']).to.include(
        request.headers['Accept']
      );
    });
  });

  it('XML response format', () => {
    const request = {
      method: 'GET',
      url: `${baseURL}/xml`,
      headers: {
        Accept: 'application/xml',
      },
    };
    cy.request(request).then((response) => {
      expect(response.headers).to.have.property('content-type');
      expect(response.headers['content-type']).to.include(
        request.headers['Accept']
      );
    });
  });
});

describe('Cookies API tests', () => {
  const baseURL = 'https://httpbin.org/';
  it('Get list of current cookies', () => {
    cy.request(`${baseURL}/cookies`).then((response) => {
      assert.equal(200, response.status);
    });
  });
  it('Create new cookie', () => {
    const newCookieName = 'wafer';
    const request = {
      method: 'GET',
      url: `${baseURL}/cookies/set`,
      qs: { freeform: newCookieName },
      failOnStatusCode: false,
    };
    cy.request(request).then((response) => {
      const data = response.body;
      expect(data.cookies).to.have.property('freeform', newCookieName);
    });
  });
  it('Delete cookies', () => {
    const request = {
      method: 'GET',
      url: `${baseURL}/cookies/delete`,
      failOnStatusCode: false,
    };
    cy.request(request).then((response) => assert.ok(response.status));
  });
});

describe('HTTP Methods - Happy path tests', () => {
  const baseURL = 'https://httpbin.org/';

  it('GET HTTP Method', () => {
    const request = {
      method: `GET`,
      url: `${baseURL}/get`,
      failOnStatusCode: false,
    };
    cy.request(request).then((response) =>
      expect(response.status).to.be.within(200, 399)
    );
  });
  it('PUT HTTP Method', () => {
    const request = {
      method: `PUT`,
      url: `${baseURL}/put`,
      failOnStatusCode: false,
    };
    cy.request(request).then((response) =>
      expect(response.status).to.be.within(200, 399)
    );
  });
  it('POST HTTP Method', () => {
    const request = {
      method: `POST`,
      url: `${baseURL}/post`,
      failOnStatusCode: false,
    };
    cy.request(request).then((response) =>
      expect(response.status).to.be.within(200, 399)
    );
  });
  it('PATCH HTTP Method', () => {
    const request = {
      method: `PATCH`,
      url: `${baseURL}/patch`,
      failOnStatusCode: false,
    };
    cy.request(request).then((response) =>
      expect(response.status).to.be.within(200, 399)
    );
  });
  it('DELETE HTTP Method', () => {
    const request = {
      method: `DELETE`,
      url: `${baseURL}/delete`,
      failOnStatusCode: false,
    };
    cy.request(request).then((response) =>
      expect(response.status).to.be.within(200, 399)
    );
  });
});

describe('HTTP Methods - Negative path tests', () => {
  const baseURL = 'https://httpbin.org/';

  it('GET Endpoint - Missmatched HTTP Method', () => {
    const request = {
      method: `POST`,
      url: `${baseURL}/get`,
      failOnStatusCode: false,
    };
    cy.request(request).then((response) =>
      expect(response.status).to.not.be.within(200, 399)
    );
  });
  it('PUT Endpoint - Missmatched HTTP Method', () => {
    const request = {
      method: `GET`,
      url: `${baseURL}/put`,
      failOnStatusCode: false,
    };
    cy.request(request).then((response) =>
      expect(response.status).to.not.be.within(200, 399)
    );
  });
  it('POST Endpoint - Missmatched HTTP Method', () => {
    const request = {
      method: `DELETE`,
      url: `${baseURL}/post`,
      failOnStatusCode: false,
    };
    cy.request(request).then((response) =>
      expect(response.status).to.not.be.within(200, 399)
    );
  });
  it('PATCH Endpoint - Missmatched HTTP Method', () => {
    const request = {
      method: `GET`,
      url: `${baseURL}/patch`,
      failOnStatusCode: false,
    };
    cy.request(request).then((response) =>
      expect(response.status).to.not.be.within(200, 399)
    );
  });
  it('DELETE Endpoint - Missmatched HTTP Method', () => {
    const request = {
      method: `PUT`,
      url: `${baseURL}/delete`,
      failOnStatusCode: false,
    };
    cy.request(request).then((response) =>
      expect(response.status).to.not.be.within(200, 399)
    );
  });
});

describe('user-agent tests', () => {
  const baseURL = 'https://httpbin.org/';
  it('Current user-agent header', () => {
    cy.request(`${baseURL}/user-agent`).then((response) =>
      expect(response.body).to.have.property('user-agent')
    );
  });

  it('Provide custom valid user-agent header', () => {
    const request = {
      method: 'GET',
      url: `${baseURL}/user-agent`,
      headers: {
        // user-agent generated via random user agent generator:
        'user-agent':
          'Mozilla/5.0 (Linux i684 x86_64) Gecko/20130401 Firefox/55.5',
      },
    };
    cy.request(request).then((response) => {
      expect(response.body).to.have.property(
        'user-agent',
        request.headers['user-agent']
      );
    });
  });

  it('Provide custom user-agent header', () => {
    const request = {
      method: 'GET',
      url: `${baseURL}/user-agent`,
      headers: {
        'user-agent': 'MyCustomUserAgent/0.0.1',
      },
    };
    cy.request(request).then((response) => {
      expect(response.body).to.have.property(
        'user-agent',
        request.headers['user-agent']
      );
    });
  });
});
