package com.logica;

import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

public class FigureEncoder implements Encoder.Text<Figure>{

    @Override
    public String encode(Figure figure) throws EncodeException {
        return figure.getJson().toString();
    }

    @Override
    public void init(EndpointConfig config) {
        System.out.println("InitE");
    }

    @Override
    public void destroy() {
        System.out.println("Destroy");
    }
    
}