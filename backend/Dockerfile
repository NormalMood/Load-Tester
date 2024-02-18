FROM openjdk:18-jdk-alpine3.15

WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline
RUN apk add --update curl
RUN curl -L https://dlcdn.apache.org//jmeter/binaries/apache-jmeter-5.6.tgz > /tmp/jmeter.tgz
RUN tar -xzf /tmp/jmeter.tgz -C /opt
COPY src ./src

EXPOSE 8080

CMD ["./mvnw", "spring-boot:run"]