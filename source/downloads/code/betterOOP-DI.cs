pubic interface INotifier {
    void Broadcast(String type, int id);
}
public class User {
    private string name;
    private int id;
    private boolean isCustomer;
    private DateTime conversionDate = null;
    private INotifier notifier;

    // INotifier interface only has one concrete implementor
    // and is hard-coded inside the class
    public User(int id, string name) : this(id, name, new Notifier()) {}

    public User(int id, string name, INotifier n) {
        this.name = name;
        this.id = id;
        this.isCustomer = false;
        this.notifier = n;
    }

    public string MakeDropDownHtml() {
       if(isCustomer) {
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
