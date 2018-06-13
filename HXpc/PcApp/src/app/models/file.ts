export class DownFile {
    public FileName: String;
}

export class ProveFile {
    public Id: Number;
    public Title: String;
    public FileName: String;
    public CreateTime: String;
    public Depart: String;
    public Reason: String;
    public Author: String;
    public Content: String;
}

export class ProveFileOper {
    public Title: String;
    public FileName: String;
    public CreateTime: String;
    public Depart: String;
    public Reason: String;
    public Author: String;
    public Content: String;
}

export class RainFile {
    public Id: Number;
    public FileName: String;
    public CreateTime: String;
    public Num: Number;
    public Author: String;
    public Content: String;
    public StartTime: String;
    public EndTime: String;
    public Precipitation: String;
}

export class RainFileOper {
    public FileName: String;
    public CreateTime: String;
    public Num: Number;
    public Author: String;
    public Content: String;
    public StartTime: String;
    public EndTime: String;
    public Precipitation: String;
}

export class ShortFile {
    public Id: Number;
    public FileName: String;
    public CreateTime: String;
    public Forecaster: String;
    public Issue: String;
    public Content: String;
}

export class ShortFileOper {
    public FileName: String;
    public CreateTime: String;
    public Forecaster: String;
    public Issue: String;
    public Content: String;
}

export class WarnFile {
    public Id: Number;
    public FileName: String;
    public CreateTime: String;
    public Num: Number;
    public Type: String;
    public Level: String;
    public Issue: String;
    public Content: String;
    public Guide: String;
    public Pic: String;
}

export class WarnFileOper {
    public FileName: String;
    public CreateTime: String;
    public Num: Number;
    public Type: String;
    public Level: String;
    public Issue: String;
    public Content: String;
    public Guide: String;
    public Pic: String;
}

