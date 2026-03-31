import os
import re

# Use windows paths if needed or relative to workspace
pages_dir = r"c:\Users\tejes\Desktop\Astronomy & Stargazing Club\pages"
pages_to_fix = ['about.html', 'blog.html', 'contact.html', 'events.html', 'gallery.html', 'observations.html', 'resources.html']

dashboard_html = """                    <li class="dropdown">
                        <a href="#" class="nav-link">Dashboard <i class="fas fa-chevron-down dropdown-icon"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="member-dashboard.html">User Dashboard</a></li>
                            <li><a href="admin-dashboard.html">Admin Dashboard</a></li>
                        </ul>
                    </li>
                </ul>"""

for page in pages_to_fix:
    path = os.path.join(pages_dir, page)
    if not os.path.exists(path):
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove Member Login
    # Using a flexible regex for variations in quotes and space
    content = re.sub(r'<a href="member-dashboard\.html" class="btn btn-outline btn-sm"[^>]*>Member Login</a>', '', content)
    
    # Replace the closing </ul> of nav-menu-list with Dashboard entry + </ul>
    # This works because the navbar structure is fairly uniform across all subpages.
    content = re.sub(r'(<li><a href="contact\.html" class="nav-link[^>]*>Contact</a></li>\s*)</ul>', r'\1' + dashboard_html, content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Navbar fix completed successfully.")
