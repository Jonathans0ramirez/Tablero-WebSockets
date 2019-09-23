package com.logica;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.nio.ByteBuffer;
import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/tablero",
        encoders = {FigureEncoder.class},
        decoders = {FigureDecoder.class})

public class TableroCompartido {

    private static Set<Session> peers
            = Collections.synchronizedSet(new HashSet<Session>());

    //Transmite a todas las sesiones el objeto figura enviado por alguien, es decir las coordenadas x , y
    @OnMessage
    public void broadcastFigure(Figure figure, Session session) throws IOException, EncodeException {
        System.out.println("broadcastFigure: " + figure);
        for (Session peer : peers) {
            if (!peer.equals(session)) {
                peer.getBasicRemote().sendObject(figure);
            }
        }
    }

    //Transmite a todas las sesiones el objeto binario enviado por alguien, esto corresponde al canvas entero
    @OnMessage
    public void broadcastSnapshot(ByteBuffer data, Session session) throws IOException {
        System.out.println("broadcastBinary: " + data);
        for (Session peer : peers) {
            if (!peer.equals(session)) {
                peer.getBasicRemote().sendBinary(data);
            }
        }
    }

    //Además de añadir la nueva sesión, envía un mensaje a los demás informando de la nueva sesión
    @OnOpen
    public void onOpen(Session p) throws IOException {
        System.out.println("Session opened ==> " + p.getId());
        peers.add(p);
        for (Session peer : peers) {
            if (!peer.equals(p)) {
                peer.getBasicRemote().sendText("Alguien se ha conectado\r\nAhora hay " + String.valueOf(peers.size() - 1) + " persona(s) más");
            }
        }
    }

    //Además de eliminar una sesión, envía un mensaje a los demás informando de la desconexión de la sesión
    @OnClose
    public void onClose(Session p) throws IOException {
        System.out.println("Session closed ==> " + p.getId());
        peers.remove(p);
        for (Session peer : peers) {
            if (!peer.equals(p)) {
                peer.getBasicRemote().sendText("Alguien se ha desconectado\r\nAhora hay " + String.valueOf(peers.size() - 1) + " persona(s) más");
            }
        }
    }

}
