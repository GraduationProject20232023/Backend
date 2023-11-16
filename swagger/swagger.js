const swaggerUi = require("swagger-ui-express")
const swaggereJsdoc = require("swagger-jsdoc")

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Handy",
      description:
        "AI를 이용한 수어 학습 웹서비스",
    },
    servers: [
      {
        url: "http://localhost:3000/", // 요청 URL 13.125.205.158
      },
    ],
  },
  apis: ["./routers/*.js"], //Swagger 파일 연동
}
const specs = swaggereJsdoc(options)

module.exports = { swaggerUi, specs }