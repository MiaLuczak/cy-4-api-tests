describe('General httpbin API tests', () => {

  // Test for loading main httpbin page
  it('Get HTML main page', () => {
    cy.request('https://httpbin.org/').then((response) =>
      // Expects status to be 200 'OK'
      assert.equal(200, response.status)
    );
  });

  // Test for deleyed response option
  it('2s Deleyed response', () => {
    const delay = 2;
    cy.request(`https://httpbin.org/delay/${delay}`).then((response) => {
      // Expects that response comes after 2s
      expect(response.duration).to.satisfy((duration) => duration >= delay);
    });
  });
});

describe('Requests formats tests', () => {
  
  // Create baseURL address sting
  const baseURL = 'https://httpbin.org';

  // Tests for most used response formats,
  // creating request constant to provide multiple request options
  // tests expects, that response headers have matching content-type property with provided header

  it('HTML response format', () => {
    const request = {
      method: 'GET',
      url: `${baseURL}/html`,
      headers: {
        Accept: 'text/html',
      },
      failOnStatusCode: false,
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
      failOnStatusCode: false
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
      failOnStatusCode: false
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
  // Create constatnt baseURL address string:
  const baseURL = 'https://httpbin.org/';

  // Test, that gets current active cookies
  it('Get list of current cookies', () => {
    cy.request(`${baseURL}/cookies`).then((response) => {
      // Asserts that response is 200 'OK', as there is possibility to response have no cookies :c 
      expect(response.body).to.have.ownProperty('cookies');
    });
  });

  // Test, that creates custom cookie
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
      // Expects to response body have created property in cookies
      expect(data.cookies).to.have.property('freeform', newCookieName);
    });
  });

  // Test, that validates deletion all created cookies
  it('Delete cookies', () => {
    const request = {
      method: 'GET',
      url: `${baseURL}/cookies/delete`,
      failOnStatusCode: false,
    };
    cy.request(request).then((response) => {
      expect(response.body.cookies).to.not.have.property('freeform')
    });
  });
});

describe('HTTP Methods - Happy path tests', () => {
  // Create baseURL address sting
  const baseURL = 'https://httpbin.org/';

  // Tests for every HTTP method
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
  // Create baseURL address sting
  const baseURL = 'https://httpbin.org/';

  // Tests for every HTTP method, using missmatched HTTP method with API endpoint
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
  // Create baseURL address sting
  const baseURL = 'https://httpbin.org/';

  // Test, that validate if user-agent property is in response header
  it('Current user-agent header', () => {
    cy.request(`${baseURL}/user-agent`).then((response) =>
      expect(response.body).to.have.property('user-agent')
    );
  });

  // Test, that provide valid custom user-agent, and validates it in response body
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

  // Test, that provide custom user-agent, and validates it in response body
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

describe('headers tests', () => {
  // Create baseURL address string:
  const baseURL = 'https://httpbin.org/';

  // Test, that validates that headers are recived in response
  it('Get current headers', () => {
    const request = {
      method: 'GET',
      url: `${baseURL}/headers`,
    };
    cy.request(request).then((response) => {
      expect(response.body.headers).to.not.be.empty;
    });
  });

  // Test, that provide custom header, and validate it in response
  it('Provide custom headers', () => {
    const request = {
      method: 'GET',
      url: `${baseURL}/headers`,
      headers: {
        'my-custom-header': 'my-custom-value',
      },
    };
    cy.request(request).then((response) => {
      expect(response.requestHeaders).to.have.property(
        'my-custom-header',
        request.headers['my-custom-header']
      );
      expect(response.body.headers).to.have.property(
        'My-Custom-Header',
        request.headers['my-custom-header']
      );
    });
  });
});
