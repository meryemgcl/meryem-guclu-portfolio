# Build aşaması
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["PortfolioWeb.csproj", "./"]
RUN dotnet restore "PortfolioWeb.csproj"
COPY . .
RUN dotnet publish "PortfolioWeb.csproj" -c Release -o /app/publish

# Runtime aşaması
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

# Render'ın dinamik port ataması için ortam değişkeni
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "PortfolioWeb.csproj.dll"]
