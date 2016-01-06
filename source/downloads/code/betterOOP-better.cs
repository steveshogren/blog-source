public interface ISalesLead {
    string IsCustomer {set;}
    DateTime ConversionDate {set;}
    int Id {get;}
}
public interface INamedIdentity {
    string DisplayName {get;}
    int Id {get;}
}
public class HtmlHelpers {
    public string MakeDropDownHtml(INamedIdentity item) {
        return String.Format("<option id=\"{0}\">{1}</option>", item.Id, item.DisplayName);
    }
}
public class User : INamedIdentity, ISalesLead {
    private string _name;
    public string DisplayName {
        get {
            return (this.IsCustomer) ? String.Format("*{0}*", this._name) : this._name;}
        };
        private set;
    }
    public int Id {get; private set;}
    public boolean IsCustomer {get;set;}
    public DateTime ConversionDate {get;set;}

    public User(int id, string name, boolean isCustomer, DateTime conversionDate) {
        this._name = name;
        this.Id = id;
        this.IsCustomer = isCustomer;
        this.ConversionDate = conversionDate;
    }
}

public class SalesRepresentative {
    internal Action<string, int> broadcast = new Notifier().Broadcast;

    public void ConvertToCustomer(ISalesLead c) {
        c.IsCustomer = true;
        c.ConversionDate = DateTime.Now;
        broadcast("CustomerConverted", c.Id);
    }
}
