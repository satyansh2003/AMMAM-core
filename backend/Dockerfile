# ==========================================
# Build Stage
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the pom.xml first to verify dependencies (caching layers)
COPY pom.xml .

# Download dependencies offline to speed up subsequent builds
RUN mvn dependency:go-offline -B

# Copy the actual source code
COPY src ./src

# Compile and package the Java application into a massive executable .jar
RUN mvn clean package -DskipTests

# ==========================================
# Production Stage
# ==========================================
FROM eclipse-temurin:21-jre
WORKDIR /app

# Only copy the compiled .jar file from the build stage to keep the Docker image small
COPY --from=build /app/target/ammam-0.0.1-SNAPSHOT.jar /app/app.jar

# Render forces applications to listen on a dynamically assigned $PORT
# If none is provided, fallback to 8080
ENV PORT=8080
EXPOSE $PORT

# Start the application
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar /app/app.jar"]
