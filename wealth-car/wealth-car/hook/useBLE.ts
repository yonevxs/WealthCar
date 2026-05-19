// hooks/useBLE.ts
"use client";

import { useState } from "react";

const SERVICE_UUID        = "0000ffe0-0000-1000-8000-00805f9b34fb";
const CHARACTERISTIC_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb";

export interface DadosVeiculo {
  vel:  number;
  rpm:  number;
  comb: number;
  hodo?: number;
}

export function useBLE() {
  const [dados, setDados]           = useState<DadosVeiculo | null>(null);
  const [conectado, setConectado]   = useState(false);
  const [conectando, setConectando] = useState(false); // <-- NOVO ESTADO
  const [erro, setErro]             = useState("");

  const conectar = async () => {
    try {
      setErro("");
      setConectando(true); // <-- INICIA O LOADING

      const device = await (navigator as any).bluetooth.requestDevice({
        // filters: [{ namePrefix: "WealthCar" }],
        acceptAllDevices: true,
        optionalServices: [SERVICE_UUID],
      });

      const server  = await device.gatt!.connect();
      const service = await server.getPrimaryService(SERVICE_UUID);
      const char    = await service.getCharacteristic(CHARACTERISTIC_UUID);

      await char.startNotifications();
      
      setConectado(true);
      setConectando(false); // <-- FINALIZA O LOADING COM SUCESSO

      char.addEventListener("characteristicvaluechanged", (event: any) => {
        const target = event.target;
        const texto  = new TextDecoder().decode(target.value);
        try {
          const json = JSON.parse(texto) as DadosVeiculo;
          setDados(json); // <-- É ISSO QUE ATUALIZA O SEU DASHBOARD
        } catch {
          console.warn("JSON inválido recebido:", texto);
        }
      });

      device.addEventListener("gattserverdisconnected", () => {
        setConectado(false);
        setDados(null);
      });

    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : "Erro ao conectar Bluetooth");
      setConectado(false);
      setConectando(false); // <-- FINALIZA O LOADING COM ERRO
    }
  };

  const desconectar = () => {
    setConectado(false);
    setDados(null);
  };

  // Se você realmente não for usar 'status', pode removê-lo do Dashboard, 
  // ou exportá-ol aqui como null/string se quiser usá-lo depois.
  return { dados, conectado, conectando, erro, conectar, desconectar }; 
}