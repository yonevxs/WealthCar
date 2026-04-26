#include <SPI.h>
#include <mcp2515.h>

// Pinos ESP32
#define CS_PIN 5

MCP2515 mcp2515(CS_PIN);

// Lista de velocidades para Cristal de 8MHz
CAN_SPEED velocidades[] = {
  CAN_1000KBPS, CAN_500KBPS, CAN_250KBPS, 
  CAN_125KBPS,  CAN_100KBPS, CAN_80KBPS, 
  CAN_50KBPS,   CAN_20KBPS,  CAN_10KBPS
};

const char* nomes[] = {
  "1000kbps", "500kbps", "250kbps", 
  "125kbps",  "100kbps", "80kbps", 
  "50kbps",   "20kbps",  "10kbps"
};

void setup() {
  Serial.begin(115200);
  
  // Inicia SPI com clock mais conservador para evitar erros de comunicação
  SPI.begin(); 
  
  delay(2000);
  Serial.println("\n--- SCANNER CAN REINICIADO ---");
}

void monitorar(const char* vel) {
  Serial.print("\n>>> SUCESSO! CONECTADO EM: ");
  Serial.println(vel);
  Serial.println("Lendo dados (Filtro: DLC > 0)...");

  while (true) {
    struct can_frame frame;
    // Se o MCP2515 travar por erro de barramento, limpamos aqui
    if (mcp2515.readMessage(&frame) == MCP2515::ERROR_OK) {
      if (frame.can_dlc > 0) {
        Serial.print("ID: 0x");
        Serial.print(frame.can_id, HEX);
        Serial.print(" | DLC: ");
        Serial.print(frame.can_dlc);
        Serial.print(" | Dados: ");
        for (int i = 0; i < frame.can_dlc; i++) {
          if (frame.data[i] < 0x10) Serial.print("0");
          Serial.print(frame.data[i], HEX);
          Serial.print(" ");
        }
        Serial.println();
      }
    }
  }
}

void loop() {
  for (int i = 0; i < 9; i++) {
    Serial.print("Buscando: ");
    Serial.print(nomes[i]);
    Serial.print("... ");

    mcp2515.reset();
    
    // Configura Bitrate para 8MHz
    if (mcp2515.setBitrate(velocidades[i], MCP_8MHZ) == MCP2515::ERROR_OK) {
      mcp2515.setNormalMode();
      
      unsigned long start = millis();
      struct can_frame frame;

      // Tenta ler por 2 segundos
      while (millis() - start < 2000) {
        if (mcp2515.readMessage(&frame) == MCP2515::ERROR_OK) {
          // Se ler qualquer mensagem (mesmo DLC 0), valida a velocidade
          monitorar(nomes[i]);
        }
      }
      Serial.println("vazio.");
    } else {
      Serial.println("Erro SPI!");
    }
    delay(100);
  }
  Serial.println("--- Ciclo de busca finalizado. Reiniciando... ---");
  delay(2000);
}