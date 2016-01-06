public interface INotifier {
    void Broadcast(string type, int id);
}
public class Notifier : INotifier {
    public void Broadcast(string type, int id) { /* Code here ...*/ }
}
public interface IHtmlHelper {
    string MakeDropDownHtml(int id, string name);
}
public class HtmlHelper : IHtmlHelper {
    public string MakeDropDownHtml(int id, string name) {
        return String.Format("<option id="{0}">{1}</option>", id, name);
    }
}
public class User {
    private string name;
    private int id;
    private boolean isCustomer;
    private DateTime conversionDate = null;
    private INotifier notifier;
    private IHtmlMaker htmlHelper;

    // INotifier interface only has one concrete implementor
    // and is hard-coded inside the class, which is
    // still a tight coupling, the interface is only used for testing
    public User(int id, string name) : this(id, name, new Notifier(), new HtmlHelper()) {}

    public User(int id, string name, INotifier n, IHtmlMaker h) {
        this.name = name;
        this.id = id;
        this.isCustomer = false;
        this.notifier = n;
        this.htmlHelper = h;
    }

    public string MakeDropDownHtml() {
        var nameToUse = (isCustomer) ? String.Format("*{1}*", name) : name;
        return htmlHelper.MakeDropDownHtml(id, nameToUse);
    }

    public void ConvertToCustomer() {
        this.isCustomer = true;
        this.conversionDate = DateTime.Now;
        this.notifier.Broadcast("CustomerConverted", this.Id);
    }
}
