public class User {
    private string name;
    private int id;
    private boolean isCustomer;
    private DateTime conversionDate = null;

    public User(int id, string name) {
        this.name = name;
        this.id = id;
        this.isCustomer = false;
    }

    public string MakeDropDownHtml() {
        if(isCustomer == true) {
            return String.Format("<option id="{0}">*{1}*</option>", id, name);
        }
        return String.Format("<option id="{0}">{1}</option>", id, name);
    }

    public void ConvertToCustomer() {
        this.isCustomer = true;
        this.conversionDate = DateTime.Now;
        new Notifier().Broadcast("CustomerConverted", this.Id);
    }
}


public class User {
    private string name;
    private int id;
    private boolean isCustomer;
    private DateTime conversionDate = null;
    private INotifier notifier;
    public User(int id, string name) : this(id, name, new Notifier()) {}

    public User(int id, string name, INotifier n) {
        this.name = name;
        this.id = id;
        this.isCustomer = false;
        this.notifier = n;
    }

    public string MakeDropDownHtml() {
        if(isCustomer == true) {
            return String.Format("<option id="{0}">*{1}*</option>", id, name);
        }
        return String.Format("<option id="{0}">{1}</option>", id, name);
    }

    public void ConvertToCustomer() {
        this.isCustomer = true;
        this.conversionDate = DateTime.Now;
        this.notifier.Broadcast("CustomerConverted", this.Id);
    }
}

public interface IDropDownItem {
    string Name {get;}
    int Id {get;}
    boolean MarkPreferred {get;}
}
public class User : IDropDownItem {
    public string Name {get; private set;}
    public int Id {get; private set;}
    public boolean MarkPreferred {get { return this.IsCustomer;}}
    public boolean IsCustomer;
    public DateTime ConversionDate;

    public User(int id, string name, boolean isCustomer, DateTime converstionDate) {
        this.Name = name;
        this.Id = id;
        this.IsCustomer = isCustomer;
        this.ConverstionDate = converstionDate;
    }
}

public class HtmlHelpers {
    public string MakeDropDownHtml(IDropDownItem item) {
        if(item.MarkPreferred == true) {
            return String.Format("<option id="{0}">*{1}*</option>", item.Id, item.Name);
        }
        return String.Format("<option id="{0}">{1}</option>", item.Id, item.Name);
    }
}

public class CustomerConverter {
    internal Action<string, string> broadcast = new Notifier().Broadcast;
    public void ConvertToCustomer(User user) {
        user.IsCustomer = true;
        user.ConversionDate = DateTime.Now;
        broadcast("CustomerConverted", this.Id);
    }
}

