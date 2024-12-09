export default {
  nodeResolve: true,
  coverage: true,
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: '5000'
    }
  },
  testRunnerHtml: (testFramework) => `
    <html>
      <body>
        <script type="module">
          import { LitElement, html, css } from 'lit';
          window.lit = { LitElement, html, css };

          // Router'ı da global olarak tanımlayalım
          const Router = {
            go: () => {}
          };
          window.VaadinRouter = { Router };
        </script>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `,
};